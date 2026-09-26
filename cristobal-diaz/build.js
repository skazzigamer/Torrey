import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as contenido from './contenido.js';
import {
  pagina404, paginaChef, paginaContacto, paginaInicio, paginaPrivacidad, paginaServicio, robots, sitemap,
} from './plantillas.js';

const RAIZ = import.meta.dirname;
const RECURSOS = path.join(RAIZ, 'recursos');
export const DESTINO = path.join(RAIZ, 'publico');

const huella = (texto) => crypto.createHash('sha256').update(texto).digest('hex').slice(0, 10);

async function existe(ruta) {
  try {
    await fs.access(ruta);
    return true;
  } catch {
    return false;
  }
}

// Una imagen declarada en contenido.js que no esta en recursos/img/ se ignora (se muestra la ilustracion)
// para no publicar una imagen rota.
async function imagenValida(nombre, donde, avisos) {
  if (!nombre) return '';
  if (await existe(path.join(RECURSOS, 'img', nombre))) return nombre;
  avisos.push(`No existe recursos/img/${nombre} (${donde}); se usa la ilustración.`);
  return '';
}

async function prepararContexto(datos, avisos) {
  const servicios = [];
  for (const s of datos.SERVICIOS) {
    const imagen = await imagenValida(s.intro.imagen, `${s.slug}.intro.imagen`, avisos);
    servicios.push({ ...s, intro: { ...s.intro, imagen } });
  }
  const chef = {
    ...datos.CHEF,
    imagen: await imagenValida(datos.CHEF.imagen, 'CHEF.imagen', avisos),
    firma: await imagenValida(datos.CHEF.firma, 'CHEF.firma', avisos),
  };
  const [css, js] = await Promise.all([
    fs.readFile(path.join(RECURSOS, 'estilos.css'), 'utf8'),
    fs.readFile(path.join(RECURSOS, 'sitio.js'), 'utf8'),
  ]);
  return {
    marca: datos.MARCA,
    contacto: datos.CONTACTO,
    sitio: { ...datos.SITIO, dominio: String(datos.SITIO.dominio || '').replace(/\/+$/, '') },
    portada: datos.PORTADA,
    principios: datos.PRINCIPIOS,
    servicios,
    chef,
    contactoPagina: datos.CONTACTO_PAGINA,
    legal: datos.LEGAL,
    version: { css: huella(css), js: huella(js) },
    anio: new Date().getFullYear(),
    prefijo: '',
  };
}

function pendientes(ctx) {
  const lista = [];
  if (!ctx.contacto.whatsapp) lista.push('CONTACTO.whatsapp: sin número no aparecen los botones de WhatsApp.');
  if (!ctx.contacto.correo) lista.push('CONTACTO.correo');
  if (!ctx.sitio.dominio) {
    lista.push('SITIO.dominio: vista previa (noindex, sin sitemap ni imagen al compartir en redes).');
  }
  if (!ctx.legal.domicilio) lista.push('LEGAL.domicilio: lo pide el aviso de privacidad.');
  const sinFoto = [
    ...ctx.servicios.filter((s) => !s.intro.imagen).map((s) => s.slug),
    ...(ctx.chef.imagen ? [] : ['chef']),
  ];
  if (sinFoto.length) lista.push(`Fotos: ${sinFoto.join(', ')}.`);
  return lista;
}

export async function construir({ destino = DESTINO, datos = contenido } = {}) {
  const salida = path.resolve(destino);
  // Nunca borrar la carpeta del proyecto ni una que la contenga.
  if (salida === RAIZ || RAIZ.startsWith(`${salida}${path.sep}`)) throw new Error(`Destino no válido: ${salida}`);

  const avisos = [];
  const ctx = await prepararContexto(datos, avisos);
  const paginas = [
    ['index.html', paginaInicio(ctx)],
    ...ctx.servicios.map((s) => [`${s.slug}.html`, paginaServicio(ctx, s)]),
    ['chef.html', paginaChef(ctx)],
    ['contacto.html', paginaContacto(ctx)],
    ['aviso-de-privacidad.html', paginaPrivacidad(ctx)],
    ['404.html', pagina404(ctx)],
  ];

  await fs.rm(salida, { recursive: true, force: true });
  await fs.mkdir(salida, { recursive: true });
  await fs.cp(RECURSOS, path.join(salida, 'assets'), { recursive: true });
  for (const [archivo, html] of paginas) await fs.writeFile(path.join(salida, archivo), html, 'utf8');

  await fs.writeFile(path.join(salida, 'robots.txt'), robots(ctx), 'utf8');
  if (ctx.sitio.dominio) {
    const publicas = paginas.map(([archivo]) => archivo).filter((archivo) => archivo !== '404.html');
    await fs.writeFile(path.join(salida, 'sitemap.xml'), sitemap(ctx, publicas), 'utf8');
  }
  await fs.writeFile(path.join(salida, '.nojekyll'), '', 'utf8');

  return { destino: salida, paginas: paginas.map(([archivo]) => archivo), pendientes: [...avisos, ...pendientes(ctx)] };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  construir()
    .then(({ destino, paginas, pendientes: lista }) => {
      console.log(`Sitio generado en ${path.relative(process.cwd(), destino) || '.'}/ (${paginas.length} páginas)`);
      if (lista.length) {
        console.log('\nPendiente antes de publicar:');
        for (const punto of lista) console.log(`  - ${punto}`);
      }
      console.log('\nVista previa: npm start');
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      process.exitCode = 1;
    });
}
