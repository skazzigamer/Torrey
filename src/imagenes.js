import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { obtenerBinario } from './http.js';
import { slugificar } from './normalize.js';

const EXTENSIONES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

function nombreArchivo(url, tipo, base, indice) {
  const extensionUrl = path.extname(new URL(url).pathname).toLowerCase();
  const extension =
    EXTENSIONES[tipo.split(';')[0].trim()] ||
    (/^\.(jpe?g|png|webp|avif|gif|svg)$/.test(extensionUrl) ? extensionUrl : '.jpg');
  const huella = createHash('sha1').update(url).digest('hex').slice(0, 8);
  return `${slugificar(base)}-${indice + 1}-${huella}${extension}`;
}

// Descarga las imagenes de cada producto y agrega las rutas locales.
// Nunca aborta el scrape: una imagen caida solo deja el campo local vacio.
export async function descargarImagenes(productos, destino, { registro = console } = {}) {
  await fs.mkdir(destino, { recursive: true });
  const yaDescargadas = new Map();
  let ok = 0;
  let fallidas = 0;

  for (const producto of productos) {
    const locales = [];
    for (const [indice, url] of producto.imagenes.entries()) {
      if (yaDescargadas.has(url)) {
        locales.push(yaDescargadas.get(url));
        continue;
      }
      try {
        const { buffer, tipo } = await obtenerBinario(url);
        const nombre = nombreArchivo(url, tipo, producto.slug, indice);
        await fs.writeFile(path.join(destino, nombre), buffer);
        const relativa = `imagenes/${nombre}`;
        yaDescargadas.set(url, relativa);
        locales.push(relativa);
        ok++;
      } catch (error) {
        fallidas++;
        registro.warn(`  ! imagen no descargada (${url}): ${error.message}`);
      }
    }
    producto.imagenesLocales = locales;
    producto.imagenLocal = locales[0] || '';
  }

  return { ok, fallidas };
}
