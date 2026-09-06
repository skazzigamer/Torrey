import fs from 'node:fs/promises';
import path from 'node:path';
import { CATEGORIAS, SITIO } from './config.js';
import { obtenerJson, obtenerTexto } from './http.js';
import {
  deduplicar, detalleDesdeHtml, productosDesdeHtml, productosDesdeJsonLd,
  productosDesdeStoreApi,
} from './extractores.js';
import { descargarImagenes } from './imagenes.js';
import { fusionar } from './normalize.js';

const opciones = parsearArgumentos(process.argv.slice(2));

function parsearArgumentos(args) {
  const salida = { imagenes: true, detalle: true, limite: Infinity, categoria: null };
  for (const arg of args) {
    if (arg === '--sin-imagenes') salida.imagenes = false;
    else if (arg === '--sin-detalle') salida.detalle = false;
    else if (arg.startsWith('--limite=')) salida.limite = Number(arg.split('=')[1]) || Infinity;
    else if (arg.startsWith('--categoria=')) salida.categoria = arg.split('=')[1];
  }
  return salida;
}

// Estrategia 1: API Store de WooCommerce. Devuelve null si el sitio no la expone.
async function intentarStoreApi(categoria) {
  try {
    const categorias = await obtenerJson(
      `${SITIO}/wp-json/wc/store/v1/products/categories?slug=${encodeURIComponent(categoria.slug)}`,
    );
    const id = categorias?.[0]?.id;
    const productos = [];
    for (let pagina = 1; pagina <= 20; pagina++) {
      const base = `${SITIO}/wp-json/wc/store/v1/products?per_page=100&page=${pagina}`;
      const url = id ? `${base}&category=${id}` : base;
      const lote = await obtenerJson(url);
      if (!Array.isArray(lote) || !lote.length) break;
      productos.push(...lote);
      if (lote.length < 100) break;
      if (!id) break; // Sin categoria no paginamos el catalogo entero.
    }
    if (!productos.length) return null;
    return productosDesdeStoreApi(productos, categoria);
  } catch {
    return null; // El sitio no tiene la API publica: seguimos con HTML.
  }
}

// Estrategia 2: HTML de la categoria + JSON-LD, siguiendo la paginacion.
async function extraerDeHtml(categoria) {
  const productos = [];
  const vistas = new Set();
  let url = categoria.url;

  for (let pagina = 1; pagina <= 30 && url && !vistas.has(url); pagina++) {
    vistas.add(url);
    let html;
    try {
      html = await obtenerTexto(url);
    } catch (error) {
      if (pagina === 1) throw error;
      break; // Se acabo la paginacion.
    }
    const enPagina = deduplicar([
      ...productosDesdeJsonLd(html, url),
      ...productosDesdeHtml(html, url, categoria),
    ]);
    if (!enPagina.length) break;
    productos.push(...enPagina.map((p) => ({ ...p, categoriaOrigen: categoria.slug })));
    url = siguientePagina(html, url);
  }

  return deduplicar(productos);
}

function siguientePagina(html, base) {
  const enlace = html.match(/<a[^>]+class="[^"]*next[^"]*"[^>]+href="([^"]+)"/i) ||
    html.match(/<a[^>]+href="([^"]+)"[^>]+class="[^"]*next[^"]*"/i) ||
    html.match(/<link[^>]+rel="next"[^>]+href="([^"]+)"/i);
  if (!enlace) return null;
  try {
    return new URL(enlace[1].replace(/&amp;/g, '&'), base).toString();
  } catch {
    return null;
  }
}

// Estrategia 3: abrir cada ficha para completar descripcion larga y galeria.
async function enriquecerConDetalle(productos) {
  let completados = 0;
  for (const producto of productos) {
    if (!producto.url) continue;
    try {
      const html = await obtenerTexto(producto.url);
      const detalle = detalleDesdeHtml(html, producto.url);
      Object.assign(producto, fusionar(producto, detalle));
      completados++;
      process.stdout.write(`\r  fichas leidas: ${completados}/${productos.length}`);
    } catch (error) {
      console.warn(`\n  ! ficha no leida (${producto.url}): ${error.message}`);
    }
  }
  if (completados) process.stdout.write('\n');
  return completados;
}

async function principal() {
  const categorias = opciones.categoria
    ? CATEGORIAS.filter((c) => c.slug === opciones.categoria)
    : CATEGORIAS;

  if (!categorias.length) {
    console.error(`No hay ninguna categoria con slug "${opciones.categoria}" en src/config.js`);
    process.exitCode = 1;
    return;
  }

  const todos = [];
  for (const categoria of categorias) {
    console.log(`\n== ${categoria.nombre} (${categoria.url})`);

    let productos = await intentarStoreApi(categoria);
    if (productos?.length) {
      console.log(`  API de WooCommerce: ${productos.length} productos`);
    } else {
      productos = await extraerDeHtml(categoria);
      console.log(`  HTML/JSON-LD: ${productos.length} productos`);
    }

    if (Number.isFinite(opciones.limite)) productos = productos.slice(0, opciones.limite);

    if (opciones.detalle && productos.some((p) => p.url)) {
      await enriquecerConDetalle(productos);
    }

    todos.push(...productos.map((p) => ({ ...p, categoriaOrigen: p.categoriaOrigen || categoria.slug })));
  }

  const productos = deduplicar(todos);

  if (opciones.imagenes) {
    console.log('\nDescargando imagenes...');
    const { ok, fallidas } = await descargarImagenes(productos, path.resolve('docs/imagenes'));
    console.log(`  ${ok} imagenes guardadas${fallidas ? `, ${fallidas} fallidas` : ''}`);
  }

  const salida = {
    generado: new Date().toISOString(),
    origen: categorias.map((c) => c.url),
    total: productos.length,
    categorias: categorias.map((c) => ({ slug: c.slug, nombre: c.nombre })),
    productos,
  };

  await fs.mkdir('data', { recursive: true });
  await fs.writeFile('data/productos.json', `${JSON.stringify(salida, null, 2)}\n`, 'utf8');

  const sinImagen = productos.filter((p) => !p.imagen).length;
  const sinDescripcion = productos.filter((p) => !p.descripcion && !p.descripcionCorta).length;
  console.log(`\nListo: ${productos.length} productos en data/productos.json`);
  if (sinImagen) console.log(`  aviso: ${sinImagen} sin imagen`);
  if (sinDescripcion) console.log(`  aviso: ${sinDescripcion} sin descripcion`);
  console.log('Siguiente paso: npm run build');
}

principal().catch((error) => {
  console.error(`\nError: ${error.message}`);
  process.exitCode = 1;
});
