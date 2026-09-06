import fs from 'node:fs/promises';
import path from 'node:path';
import { MARCA } from './config.js';
import { paginaIndice, paginaProducto } from './plantillas.js';
import { ESTILOS, GUION_INDICE, GUION_FICHA } from './estaticos.js';

const ORIGEN = process.argv[2] || 'data/productos.json';
const DESTINO = 'docs';

async function leerDatos() {
  try {
    return JSON.parse(await fs.readFile(ORIGEN, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(
        `No existe ${ORIGEN}. Ejecuta primero "npm run scrape", ` +
          'o prueba con los datos de ejemplo: node src/build.js data/productos.ejemplo.json',
      );
      process.exit(1);
    }
    throw error;
  }
}

async function principal() {
  const datos = await leerDatos();
  const productos = datos.productos || [];
  if (!productos.length) {
    console.error(`${ORIGEN} no contiene productos.`);
    process.exit(1);
  }

  const categorias =
    datos.categorias?.length
      ? datos.categorias
      : [...new Set(productos.map((p) => p.categoriaOrigen).filter(Boolean))].map((slug) => ({
          slug,
          nombre: slug,
        }));

  await fs.mkdir(path.join(DESTINO, 'assets'), { recursive: true });
  await fs.mkdir(path.join(DESTINO, 'producto'), { recursive: true });

  await fs.writeFile(path.join(DESTINO, 'assets/estilos.css'), ESTILOS, 'utf8');
  await fs.writeFile(path.join(DESTINO, 'assets/app.js'), GUION_INDICE, 'utf8');
  await fs.writeFile(path.join(DESTINO, 'assets/ficha.js'), GUION_FICHA, 'utf8');

  await fs.writeFile(
    path.join(DESTINO, 'index.html'),
    paginaIndice({ marca: MARCA, categorias, productos }),
    'utf8',
  );

  const usados = new Set();
  for (const producto of productos) {
    // Dos productos con el mismo titulo no deben pisarse el archivo.
    let slug = producto.slug;
    let n = 2;
    while (usados.has(slug)) slug = `${producto.slug}-${n++}`;
    usados.add(slug);
    producto.slug = slug;
  }

  for (const producto of productos) {
    await fs.writeFile(
      path.join(DESTINO, 'producto', `${producto.slug}.html`),
      paginaProducto({ marca: MARCA, producto }),
      'utf8',
    );
  }

  // El JSON queda publicado por si otra pagina o app lo quiere consumir.
  await fs.writeFile(path.join(DESTINO, 'productos.json'), `${JSON.stringify(datos, null, 2)}\n`, 'utf8');
  await fs.writeFile(path.join(DESTINO, '.nojekyll'), '', 'utf8');

  console.log(`Sitio generado en ${DESTINO}/`);
  console.log(`  index.html + ${productos.length} fichas en ${DESTINO}/producto/`);
  console.log('Vista previa: npm start');
}

principal().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
