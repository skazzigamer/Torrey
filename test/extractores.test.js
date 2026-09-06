import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {
  deduplicar, detalleDesdeHtml, productosDesdeHtml, productosDesdeJsonLd,
  productosDesdeStoreApi,
} from '../src/extractores.js';
import { fusionar, imagenOriginal, mejorDeSrcset, parsearPrecio, sanearHtml } from '../src/normalize.js';

const raiz = path.join(import.meta.dirname, 'fixtures');
const leer = (n) => fs.readFileSync(path.join(raiz, n), 'utf8');
const BASE = 'https://ejemplo.test/amasadoras/';

test('Store API: titulo, descripciones, precio e imagenes', () => {
  const [producto] = productosDesdeStoreApi(JSON.parse(leer('store-api.json')), {
    slug: 'catalogo-torrey',
  });
  assert.equal(producto.titulo, 'Sierra para Hueso ST-295');
  assert.equal(producto.sku, 'ST-295');
  assert.equal(producto.descripcionCorta, 'Sierra de cinta para hueso.');
  assert.match(producto.descripcion, /Estructura de acero inoxidable/);
  assert.match(producto.descripcion, /• Motor 1 HP/);
  assert.equal(producto.precio, 18990);
  assert.equal(producto.imagenes.length, 2);
  // La miniatura -800x800 se sustituye por el original.
  assert.equal(producto.imagen, 'https://ejemplo.test/wp-content/uploads/sierra.jpg');
  assert.equal(producto.categoriaOrigen, 'catalogo-torrey');
});

test('JSON-LD: lee productos dentro de un ItemList y de @graph', () => {
  const productos = productosDesdeJsonLd(leer('categoria.html'), BASE);
  assert.equal(productos.length, 1);
  assert.equal(productos[0].titulo, 'Amasadora de Espiral 25 kg');
  assert.equal(productos[0].precio, 48900);
  assert.equal(productos[0].marca, 'Torrey');
  assert.equal(productos[0].imagen, 'https://ejemplo.test/wp-content/uploads/amasadora-25.jpg');
});

test('HTML: extrae las tarjetas de la rejilla y descarta el ruido', () => {
  const productos = productosDesdeHtml(leer('categoria.html'), BASE, { slug: 'amasadoras' });
  assert.equal(productos.length, 2);
  const [primero, segundo] = productos;
  assert.equal(primero.titulo, 'Amasadora de Espiral 25 kg');
  // Del srcset toma la variante grande y la vuelve original.
  assert.equal(primero.imagen, 'https://ejemplo.test/wp-content/uploads/amasadora-25.jpg');
  assert.equal(primero.precio, 48900);
  assert.equal(segundo.titulo, 'Batidora 20 Lt');
  // Imagen diferida en data-src.
  assert.equal(segundo.imagen, 'https://ejemplo.test/wp-content/uploads/batidora-20.png');
  // "Añadir al carrito" no debe convertirse en producto.
  assert.ok(!productos.some((p) => /carrito/i.test(p.titulo)));
});

test('Ficha: descripcion larga, galeria, atributos y saneado', () => {
  const detalle = detalleDesdeHtml(leer('producto.html'), 'https://ejemplo.test/producto/amasadora-espiral-25/');
  assert.equal(detalle.titulo, 'Amasadora de Espiral 25 kg');
  assert.equal(detalle.sku, 'AE-25');
  assert.equal(detalle.descripcionCorta, 'Ideal para panadería mediana.');
  assert.match(detalle.descripcion, /Capacidad 25 kg/);
  assert.equal(detalle.precio, 48900);
  assert.equal(detalle.atributos.Capacidad, '25 kg');
  assert.equal(detalle.atributos.Voltaje, '220 V');
  // data-large_image gana sobre la miniatura; las URLs quedan absolutas.
  assert.equal(detalle.imagenes[0], 'https://ejemplo.test/wp-content/uploads/amasadora-25.jpg');
  assert.equal(detalle.imagenes.length, 2);
  // Nada de scripts ni atributos heredados en el HTML publicado.
  assert.ok(!/<script|onclick|style=/.test(detalle.descripcionHtml));
  assert.match(detalle.descripcionHtml, /<strong>espiral<\/strong>/);
});

test('deduplicar fusiona el mismo producto de dos fuentes', () => {
  const html = productosDesdeHtml(leer('categoria.html'), BASE, { slug: 'amasadoras' });
  const jsonLd = productosDesdeJsonLd(leer('categoria.html'), BASE);
  const unidos = deduplicar([...html, ...jsonLd]);
  assert.equal(unidos.length, 2);
  const amasadora = unidos.find((p) => p.titulo.startsWith('Amasadora'));
  // El JSON-LD aporta la descripcion que la tarjeta no traia.
  assert.match(amasadora.descripcion, /espiral para 25 kg/);
  assert.equal(amasadora.sku, 'AE-25');
});

test('utilidades de normalizacion', () => {
  assert.equal(mejorDeSrcset('a-300.jpg 300w, b-900.jpg 900w'), 'b-900.jpg');
  assert.equal(imagenOriginal('https://x.test/a-1024x768.webp'), 'https://x.test/a.webp');
  assert.equal(parsearPrecio('$ 12,345.00 MXN').valor, 12345);
  assert.equal(parsearPrecio('1.234,50').valor, 1234.5);
  assert.equal(parsearPrecio('Consultar').valor, null);
  assert.equal(sanearHtml('<p class="x">Hola<script>malo()</script></p>'), '<p>Hola</p>');
});

test('fusionar conserva lo ya extraido y combina listas y atributos', () => {
  const unido = fusionar(
    { titulo: 'A', descripcion: 'corta', imagenes: ['1.jpg'], atributos: {}, precio: null },
    { descripcion: 'una descripcion mucho mas completa', imagenes: ['2.jpg'], atributos: { Voltaje: '220 V' }, precio: 10 },
  );
  assert.equal(unido.titulo, 'A');
  assert.equal(unido.descripcion, 'una descripcion mucho mas completa');
  assert.deepEqual(unido.imagenes, ['1.jpg', '2.jpg']);
  assert.deepEqual(unido.atributos, { Voltaje: '220 V' });
  assert.equal(unido.precio, 10);
  // Un valor vacio nunca pisa uno ya extraido.
  assert.equal(fusionar({ sku: 'AE-25' }, { sku: '' }).sku, 'AE-25');
});
