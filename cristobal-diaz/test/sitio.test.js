import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { construir } from '../build.js';
import * as contenido from '../contenido.js';
import { enlaceWhatsApp, enriquecer, escapar, telefonoInternacional } from '../plantillas.js';

const PAGINAS = [
  'index.html',
  'asesorias.html',
  'mystery-guest.html',
  'alta-pasteleria.html',
  'pasteleria-de-lujo.html',
  'chef.html',
  'contacto.html',
  'aviso-de-privacidad.html',
  '404.html',
];

const conDatos = {
  ...contenido,
  CONTACTO: { ...contenido.CONTACTO, whatsapp: '523312345678', correo: 'hola@ejemplo.test', instagram: 'atelier' },
  SITIO: { dominio: 'https://ejemplo.test/' },
};

const temporales = [];
const temporal = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atelier-'));
  temporales.push(dir);
  return dir;
};
test.after(() => {
  for (const dir of temporales) fs.rmSync(dir, { recursive: true, force: true });
});
const leer = (dir, archivo) => fs.readFileSync(path.join(dir, archivo), 'utf8');

async function compilar(datos) {
  const destino = temporal();
  const resultado = await construir({ destino, datos });
  return { ...resultado, dir: destino };
}

const vistaPrevia = await compilar(contenido);
const publicado = await compilar(conDatos);

test('genera todas las páginas y los recursos', () => {
  assert.deepEqual(vistaPrevia.paginas, PAGINAS);
  for (const archivo of [
    ...PAGINAS,
    'robots.txt',
    'assets/estilos.css',
    'assets/sitio.js',
    'assets/fuentes/poppins-800.woff2',
    'assets/img/og.jpg',
    'assets/img/favicon.svg',
  ]) {
    assert.ok(fs.existsSync(path.join(vistaPrevia.dir, archivo)), `falta ${archivo}`);
  }
});

test('los enlaces, recursos y anclas internas existen', () => {
  for (const { dir } of [vistaPrevia, publicado]) {
    for (const archivo of PAGINAS) {
      const html = leer(dir, archivo);
      const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
      for (const [, destino] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
        if (/^(https?:|mailto:|tel:|data:)/.test(destino)) continue;
        if (destino.startsWith('#')) {
          assert.ok(ids.has(destino.slice(1)), `${archivo}: ancla ${destino} sin destino`);
          continue;
        }
        const ruta = destino.split(/[?#]/)[0];
        const local = ruta.startsWith('/') ? path.join(dir, ruta) : path.join(dir, path.dirname(archivo), ruta);
        assert.ok(fs.existsSync(local), `${archivo}: enlace roto ${destino}`);
      }
    }
    const css = leer(dir, 'assets/estilos.css');
    for (const [, fuente] of css.matchAll(/url\('(fuentes\/[^']+)'\)/g)) {
      assert.ok(fs.existsSync(path.join(dir, 'assets', fuente)), `estilos.css: falta ${fuente}`);
    }
  }
});

test('cada página tiene idioma, título, descripción y un solo h1', () => {
  for (const archivo of PAGINAS) {
    const html = leer(publicado.dir, archivo);
    assert.match(html, /<html lang="es-MX">/, archivo);
    assert.match(html, /<title>[^<]{10,}<\/title>/, archivo);
    assert.match(html, /<meta name="description" content="[^"]{20,}">/, archivo);
    assert.equal(html.match(/<h1[\s>]/g)?.length, 1, `${archivo}: debe tener un h1`);
    assert.doesNotMatch(html, /undefined|\[object Object\]|>null</, archivo);
  }
});

test('los datos estructurados son JSON válido', () => {
  for (const archivo of PAGINAS) {
    const html = leer(publicado.dir, archivo);
    for (const [, bloque] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const datos = JSON.parse(bloque);
      assert.equal(datos['@context'], 'https://schema.org', archivo);
    }
  }
  const inicio = leer(publicado.dir, 'index.html');
  const organizacion = JSON.parse(inicio.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(organizacion.hasOfferCatalog.itemListElement.length, contenido.SERVICIOS.length);
  assert.equal(organizacion.telephone, '+523312345678');
});

test('sin número no hay botones de WhatsApp; con número llevan el mensaje de cada página', () => {
  for (const archivo of PAGINAS) assert.doesNotMatch(leer(vistaPrevia.dir, archivo), /wa\.me/, archivo);

  const pagina = leer(publicado.dir, 'mystery-guest.html');
  const mensaje = encodeURIComponent('Hola, me interesa el servicio de Mystery Guest para mi negocio.');
  assert.ok(pagina.includes(`class="flotante" href="https://wa.me/523312345678?text=${mensaje}"`));
  assert.match(leer(publicado.dir, 'contacto.html'), /data-whatsapp="523312345678"/);
  assert.match(leer(publicado.dir, 'contacto.html'), /value="whatsapp"/);
});

test('sin dominio el sitio queda en vista previa; con dominio es indexable', () => {
  assert.match(leer(vistaPrevia.dir, 'index.html'), /<meta name="robots" content="noindex">/);
  assert.equal(leer(vistaPrevia.dir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  assert.ok(!fs.existsSync(path.join(vistaPrevia.dir, 'sitemap.xml')));
  assert.doesNotMatch(leer(vistaPrevia.dir, 'index.html'), /og:image/);

  const inicio = leer(publicado.dir, 'index.html');
  assert.doesNotMatch(inicio, /noindex/);
  assert.match(inicio, /<link rel="canonical" href="https:\/\/ejemplo\.test\/">/);
  assert.match(inicio, /<meta property="og:image" content="https:\/\/ejemplo\.test\/assets\/img\/og\.jpg">/);
  const sitemap = leer(publicado.dir, 'sitemap.xml');
  assert.equal(sitemap.match(/<loc>/g).length, PAGINAS.length - 1);
  assert.doesNotMatch(sitemap, /404|ejemplo\.test\/\//);
  assert.match(leer(publicado.dir, '404.html'), /noindex/);
});

test('avisa lo pendiente y no publica imágenes que no existen', async () => {
  assert.ok(vistaPrevia.pendientes.some((p) => p.startsWith('CONTACTO.whatsapp')));
  assert.ok(!publicado.pendientes.some((p) => p.startsWith('CONTACTO.whatsapp')));

  const { dir, pendientes } = await compilar({ ...contenido, CHEF: { ...contenido.CHEF, imagen: 'no-existe.jpg' } });
  assert.ok(pendientes.some((p) => p.includes('recursos/img/no-existe.jpg')));
  assert.doesNotMatch(leer(dir, 'chef.html'), /no-existe\.jpg/);
  assert.match(leer(dir, 'chef.html'), /class="monograma"/);
});

test('rechaza tipos de bloque desconocidos y destinos peligrosos', async () => {
  const [primero, ...resto] = contenido.SERVICIOS;
  const roto = { ...contenido, SERVICIOS: [{ ...primero, bloques: [{ tipo: 'galeria' }] }, ...resto] };
  await assert.rejects(construir({ destino: temporal(), datos: roto }), /Tipo de bloque desconocido: "galeria"/);
  await assert.rejects(construir({ destino: path.join(import.meta.dirname, '..') }), /Destino no válido/);
});

test('escapa el contenido y marca las cursivas', () => {
  assert.equal(escapar(`<a href="x">'&'</a>`), '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  assert.equal(enriquecer('Un *atelier* <b>'), 'Un <em>atelier</em> &lt;b&gt;');
});

test('arma los enlaces de WhatsApp y el teléfono internacional', () => {
  assert.equal(enlaceWhatsApp(''), '');
  assert.equal(enlaceWhatsApp('+52 33 1234 5678'), 'https://wa.me/523312345678');
  assert.equal(
    enlaceWhatsApp('523312345678', 'Hola & adiós'),
    'https://wa.me/523312345678?text=Hola%20%26%20adi%C3%B3s',
  );
  assert.equal(telefonoInternacional({ telefono: '33 1234 5678' }), '+523312345678');
  assert.equal(telefonoInternacional({ whatsapp: '5213312345678' }), '+523312345678');
  assert.equal(telefonoInternacional({}), '');
});
