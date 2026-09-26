import { createServer } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

// Servidor estatico minimo para revisar publico/ antes de subirlo.
const RAIZ = path.join(import.meta.dirname, 'publico');
const PUERTO = Number(process.env.PUERTO || 4174);

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.svg': 'image/svg+xml',
};

async function archivoPara(ruta) {
  const base = path.join(RAIZ, ruta);
  if (path.relative(RAIZ, base).startsWith('..')) return null;
  // Igual que Netlify o Vercel: /asesorias sirve asesorias.html y /carpeta/ sirve su index.html.
  for (const candidato of [base, path.join(base, 'index.html'), `${base}.html`]) {
    try {
      if ((await fs.stat(candidato)).isFile()) return candidato;
    } catch {
      // se prueba el siguiente candidato
    }
  }
  return null;
}

createServer(async (peticion, respuesta) => {
  let ruta;
  try {
    ruta = decodeURIComponent(new URL(peticion.url, 'http://local').pathname);
  } catch {
    respuesta.writeHead(400).end('Solicitud no válida');
    return;
  }
  const archivo = await archivoPara(ruta);
  if (!archivo) {
    const pagina = await fs.readFile(path.join(RAIZ, '404.html')).catch(() => 'No encontrado');
    respuesta.writeHead(404, { 'Content-Type': TIPOS['.html'] }).end(pagina);
    return;
  }
  const contenido = await fs.readFile(archivo);
  respuesta.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream' });
  respuesta.end(contenido);
}).listen(PUERTO, () => {
  console.log(`Vista previa en http://localhost:${PUERTO}`);
});
