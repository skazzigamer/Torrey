import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as contenido from './contenido.js';
import {
  pagina404, paginaChef, paginaContacto, paginaInicio, paginaPrivacidad, paginaServicio, paginaTienda, robots,
  sitemap,
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

// Revisa el catalogo. Los productos marcados como ejemplo solo aparecen en la vista previa.
async function prepararCatalogo(datos, publicar, avisos) {
  const categorias = new Set(datos.TIENDA.categorias.map((c) => c.id));
  const vistos = new Set();
  const catalogo = [];
  let ejemplos = 0;
  for (const producto of datos.CATALOGO) {
    const { id } = producto;
    if (!/^[a-z0-9-]+$/.test(id || '')) throw new Error(`CATALOGO: id no válido "${id}" (minúsculas, números y guiones)`);
    if (vistos.has(id)) throw new Error(`CATALOGO: el id "${id}" está repetido`);
    vistos.add(id);
    if (!categorias.has(producto.categoria)) {
      throw new Error(`CATALOGO: la categoría "${producto.categoria}" de "${id}" no existe en TIENDA.categorias`);
    }
    if (producto.precio != null && !(Number.isFinite(producto.precio) && producto.precio >= 0)) {
      throw new Error(`CATALOGO: el precio de "${id}" debe ser un número o null`);
    }
    if (producto.ejemplo) {
      ejemplos += 1;
      if (publicar) continue;
    }
    let pago = producto.pago || '';
    if (pago && !/^https:\/\/\S+$/.test(pago)) {
      avisos.push(`CATALOGO: el link de pago de "${id}" debe empezar con https://; se omitió.`);
      pago = '';
    }
    const imagen = await imagenValida(producto.imagen, `CATALOGO ${id}`, avisos);
    catalogo.push({ detalles: [], ...producto, pago, imagen });
  }
  if (ejemplos) {
    avisos.push(
      publicar
        ? `CATALOGO: se omitieron ${ejemplos} productos de ejemplo.`
        : `CATALOGO: ${ejemplos} productos de ejemplo (solo se ven en la vista previa); reemplázalos con los del cliente.`,
    );
  }
  return catalogo;
}

async function prepararContexto(datos, avisos) {
  const servicios = [];
  for (const [i, s] of datos.SERVICIOS.entries()) {
    const imagen = await imagenValida(s.intro.imagen, `${s.slug}.intro.imagen`, avisos);
    servicios.push({ ...s, numero: String(i + 1).padStart(2, '0'), intro: { ...s.intro, imagen } });
  }
  const dominio = String(datos.SITIO.dominio || '').replace(/\/+$/, '');
  const catalogo = await prepararCatalogo(datos, Boolean(dominio), avisos);
  const chef = {
    ...datos.CHEF,
    imagen: await imagenValida(datos.CHEF.imagen, 'CHEF.imagen', avisos),
    firma: await imagenValida(datos.CHEF.firma, 'CHEF.firma', avisos),
  };
  const [css, js, pedido] = await Promise.all(
    ['estilos.css', 'sitio.js', 'pedido.js'].map((archivo) => fs.readFile(path.join(RECURSOS, archivo), 'utf8')),
  );
  return {
    marca: datos.MARCA,
    contacto: datos.CONTACTO,
    sitio: { ...datos.SITIO, dominio },
    portada: datos.PORTADA,
    principios: datos.PRINCIPIOS,
    servicios,
    chef,
    contactoPagina: datos.CONTACTO_PAGINA,
    legal: datos.LEGAL,
    tienda: datos.TIENDA,
    catalogo,
    version: { css: huella(css), js: huella(js), pedido: huella(pedido) },
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
  const sinPrecio = ctx.catalogo.filter((p) => !p.ejemplo && p.precio == null).map((p) => p.id);
  if (sinPrecio.length) lista.push(`CATALOGO sin precio (se mostrará a cotizar): ${sinPrecio.join(', ')}.`);
  if (!ctx.tienda.pagos) lista.push('TIENDA.pagos: formas de pago que acepta el cliente.');
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
    ['tienda.html', paginaTienda(ctx)],
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
