// Genera data/productos.ejemplo.json a partir de los fixtures locales.
// Sirve para ver el diseño del catalogo sin tocar la red.
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  deduplicar, detalleDesdeHtml, productosDesdeHtml, productosDesdeJsonLd,
  productosDesdeStoreApi,
} from './extractores.js';
import { fusionar } from './normalize.js';

const raiz = path.join(import.meta.dirname, '../test/fixtures');
const leer = (n) => fs.readFile(path.join(raiz, n), 'utf8');

const categoriaHtml = await leer('categoria.html');
const productoHtml = await leer('producto.html');
const storeApi = JSON.parse(await leer('store-api.json'));

const base = 'https://ejemplo.test/amasadoras/';
const amasadoras = deduplicar([
  ...productosDesdeJsonLd(categoriaHtml, base),
  ...productosDesdeHtml(categoriaHtml, base, { slug: 'amasadoras' }),
]).map((p) => ({ ...p, categoriaOrigen: 'amasadoras' }));

const primera = amasadoras[0];
if (primera) {
  Object.assign(primera, fusionar(primera, detalleDesdeHtml(productoHtml, primera.url)));
}

const torrey = productosDesdeStoreApi(storeApi, { slug: 'catalogo-torrey' });

const datos = {
  generado: new Date().toISOString(),
  origen: ['fixtures locales'],
  ejemplo: true,
  categorias: [
    { slug: 'catalogo-torrey', nombre: 'Catálogo Torrey' },
    { slug: 'amasadoras', nombre: 'Amasadoras' },
  ],
  total: torrey.length + amasadoras.length,
  productos: [...torrey, ...amasadoras],
};

await fs.mkdir('data', { recursive: true });
await fs.writeFile('data/productos.ejemplo.json', `${JSON.stringify(datos, null, 2)}\n`, 'utf8');
console.log(`data/productos.ejemplo.json: ${datos.total} productos de ejemplo`);
