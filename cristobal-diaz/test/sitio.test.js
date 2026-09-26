import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { construir } from '../build.js';
import * as contenido from '../contenido.js';
import { enlaceWhatsApp, enriquecer, escapar, formatoPrecio, telefonoInternacional } from '../plantillas.js';

const PAGINAS = [
  'index.html',
  'cursos.html',
  'asesorias.html',
  'mystery-guest.html',
  'alta-pasteleria.html',
  'pasteleria-de-lujo.html',
  'chef.html',
  'tienda.html',
  'contacto.html',
  'aviso-de-privacidad.html',
  '404.html',
];

// Productos "reales" (no de ejemplo) para probar la tienda publicada.
const AJUSTES = {
  'chocolate-bomboneria': { precio: 1800, fecha: 'Sábado 14 de noviembre', cupo: 8 },
  'fundamentos-pasteleria': { precio: 4200, pago: 'https://mpago.la/ejemplo' },
  'postres-emplatados': { precio: 2400, agotado: true },
  'caja-bombones': { precio: 650.5 },
  'pastel-de-autor': { precio: 1500, desde: true },
};
const conDatos = {
  ...contenido,
  CONTACTO: { ...contenido.CONTACTO, whatsapp: '523312345678', correo: 'hola@ejemplo.test', instagram: 'atelier' },
  SITIO: { dominio: 'https://ejemplo.test/' },
  CATALOGO: contenido.CATALOGO.map((p) => ({ ...p, ...AJUSTES[p.id], ejemplo: false })),
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
const soloEjemplos = await compilar({ ...contenido, SITIO: { dominio: 'https://ejemplo.test' } });

test('genera todas las páginas y los recursos', () => {
  assert.deepEqual(vistaPrevia.paginas, PAGINAS);
  for (const archivo of [
    ...PAGINAS,
    'robots.txt',
    'assets/estilos.css',
    'assets/sitio.js',
    'assets/pedido.js',
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
    // Cada seccion se anuncia con su titulo: dos secciones con el mismo nombre confunden al lector de pantalla.
    const nombres = [...html.matchAll(/<section[^>]*aria-(labelledby|label)="([^"]+)"/g)].map(([, tipo, valor]) =>
      tipo === 'label' ? valor : html.match(new RegExp(`id="${valor}"[^>]*>([\\s\\S]*?)</h[12]>`))[1].replace(/<[^>]+>/g, ''),
    );
    assert.equal(new Set(nombres).size, nombres.length, `${archivo}: secciones con el mismo nombre: ${nombres}`);
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
  // Sin WhatsApp, "Apartar lugar" lleva al formulario de la especialidad.
  assert.match(leer(vistaPrevia.dir, 'tienda.html'), /href="contacto\.html\?servicio=cursos" data-agregar="fundamentos-pasteleria"/);

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

const tarjeta = (nombre) => `class="producto__nombre">${escapar(nombre)}</h3>`;
const catalogoDe = (html) => JSON.parse(html.match(/<script type="application\/json" id="catalogo">([\s\S]*?)<\/script>/)[1]);

test('los productos de ejemplo solo aparecen en la vista previa', () => {
  const nombres = contenido.CATALOGO.filter((p) => p.ejemplo).map((p) => p.nombre);
  assert.ok(nombres.length > 0);
  for (const nombre of nombres) assert.ok(leer(vistaPrevia.dir, 'tienda.html').includes(tarjeta(nombre)), nombre);
  assert.ok(vistaPrevia.pendientes.some((p) => p.includes('productos de ejemplo')));

  for (const archivo of PAGINAS) {
    const html = leer(soloEjemplos.dir, archivo);
    for (const nombre of nombres) assert.ok(!html.includes(tarjeta(nombre)), `${archivo}: ${nombre}`);
    assert.deepEqual(catalogoDe(html).productos, {}, archivo);
  }
  assert.match(leer(soloEjemplos.dir, 'tienda.html'), /class="vacio"/);
  assert.match(leer(soloEjemplos.dir, 'cursos.html'), /Muy pronto anunciaremos nuevas fechas/);
  assert.doesNotMatch(leer(soloEjemplos.dir, 'index.html'), /id="cursos-titulo"/);
});

test('la tienda muestra precio, cupo, pago en línea y agotado', () => {
  const tienda = leer(publicado.dir, 'tienda.html');
  assert.match(tienda, /<span class="producto__monto">\$4,200<\/span> <span class="producto__unidad">MXN · por persona<\/span>/);
  assert.match(tienda, /<span class="producto__desde">Desde<\/span> <span class="producto__monto">\$1,500<\/span>/);
  assert.match(tienda, /\$650\.50/);
  assert.match(tienda, /<li>Cupo: 8 lugares<\/li>/);
  assert.match(tienda, /href="https:\/\/mpago\.la\/ejemplo" target="_blank" rel="noopener">Pagar en línea</);
  assert.match(tienda, /Precio a cotizar/);
  assert.match(tienda, /producto__sello">Agotado<[\s\S]*?Lista de espera</);
  const interes = encodeURIComponent('Hola, me interesa: Chocolate y bombonería (Sábado 14 de noviembre).');
  assert.ok(tienda.includes(`href="https://wa.me/523312345678?text=${interes}"`));

  const ld = JSON.parse(tienda.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const ofertas = ld.itemListElement.map((e) => [e.item['@type'], e.item.name, e.item.offers.price]);
  assert.deepEqual(ofertas.find((o) => o[1] === 'Caja de bombones'), ['Product', 'Caja de bombones', 650.5]);
  assert.deepEqual(ofertas.find((o) => o[1] === 'Postres emplatados'), ['Course', 'Postres emplatados', 2400]);
  assert.equal(ld.itemListElement.length, Object.keys(AJUSTES).length);
});

test('cada botón de agregar corresponde a un producto del pedido', () => {
  for (const { dir } of [vistaPrevia, publicado]) {
    for (const archivo of PAGINAS) {
      const html = leer(dir, archivo);
      const { productos } = catalogoDe(html);
      for (const [, id] of html.matchAll(/data-agregar="([^"]+)"/g)) assert.ok(productos[id], `${archivo}: ${id}`);
    }
  }
  const { productos } = catalogoDe(leer(publicado.dir, 'index.html'));
  assert.equal(productos['postres-emplatados'], undefined, 'un producto agotado no se puede pedir');
  assert.deepEqual(productos['chocolate-bomboneria'], {
    nombre: 'Chocolate y bombonería',
    precio: 1800,
    fecha: 'Sábado 14 de noviembre',
    unidad: 'por persona',
    maximo: 8,
    entrega: false,
  });
  assert.equal(productos['caja-bombones'].entrega, true);
});

test('el pedido arma el mensaje de WhatsApp con totales y datos de entrega', () => {
  const codigo = fs.readFileSync(path.join(import.meta.dirname, '../recursos/pedido.js'), 'utf8');
  const entorno = { Intl, Date };
  vm.runInNewContext(codigo, entorno);
  const { mensajePedido, resumen, formatoPrecio: formatoNavegador, fechaLarga } = entorno.AtelierPedido;

  const lineas = [
    { nombre: 'Chocolate y bombonería', cantidad: 2, precio: 1800, fecha: 'Sábado 14 de noviembre' },
    { nombre: 'Caja de bombones', cantidad: 1, precio: 650.5 },
    { nombre: 'Tarta fina de temporada', cantidad: 1, precio: null },
  ];
  assert.deepEqual({ ...resumen(lineas) }, { piezas: 4, total: 4250.5, porCotizar: 1 });
  assert.equal(
    mensajePedido({
      lineas,
      datos: { nombre: 'Ana', entrega: 'Envío a domicilio', fecha: fechaLarga('2026-12-24'), notas: '' },
    }),
    [
      'Hola, quiero hacer un pedido:',
      '',
      '• 2 × Chocolate y bombonería (Sábado 14 de noviembre): $3,600',
      '• 1 × Caja de bombones: $650.50',
      '• 1 × Tarta fina de temporada: por cotizar',
      '',
      'Subtotal: $4,250.50 MXN',
      'Hay productos por cotizar.',
      '',
      'Nombre: Ana',
      'Entrega: Envío a domicilio',
      'Fecha deseada: 24 de diciembre de 2026',
    ].join('\n'),
  );
  assert.match(mensajePedido({ lineas: [lineas[2]] }), /Quiero conocer precio y disponibilidad\.$/);
  // El navegador y las plantillas formatean igual.
  for (const valor of [0, 650.5, 1800, 12345.678]) assert.equal(formatoNavegador(valor), formatoPrecio(valor));
});

test('rechaza catálogos inválidos', async () => {
  const [primero, ...resto] = contenido.CATALOGO;
  const casos = [
    [[primero, primero, ...resto], /el id "fundamentos-pasteleria" está repetido/],
    [[{ ...primero, categoria: 'vinos' }], /la categoría "vinos"/],
    [[{ ...primero, precio: '1800' }], /debe ser un número o null/],
    [[{ ...primero, id: 'Curso Uno' }], /id no válido/],
  ];
  for (const [CATALOGO, error] of casos) {
    await assert.rejects(construir({ destino: temporal(), datos: { ...contenido, CATALOGO } }), error);
  }
  const { pendientes } = await compilar({ ...contenido, CATALOGO: [{ ...primero, pago: 'mpago.la/sin-https' }] });
  assert.ok(pendientes.some((p) => p.includes('debe empezar con https://')));
});
