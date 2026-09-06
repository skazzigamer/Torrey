import { createServer } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

// Servidor estatico minimo para revisar docs/ antes de publicar.
const RAIZ = path.resolve('docs');
const PUERTO = Number(process.env.PUERTO || 4173);

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.svg': 'image/svg+xml',
};

createServer(async (peticion, respuesta) => {
  const ruta = decodeURIComponent(new URL(peticion.url, 'http://local').pathname);
  let archivo = path.join(RAIZ, ruta);
  if (!archivo.startsWith(RAIZ)) {
    respuesta.writeHead(403).end('Prohibido');
    return;
  }
  try {
    if ((await fs.stat(archivo)).isDirectory()) archivo = path.join(archivo, 'index.html');
  } catch {
    respuesta.writeHead(404).end('No encontrado');
    return;
  }
  try {
    const contenido = await fs.readFile(archivo);
    respuesta.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream' });
    respuesta.end(contenido);
  } catch {
    respuesta.writeHead(404).end('No encontrado');
  }
}).listen(PUERTO, () => {
  console.log(`Vista previa en http://localhost:${PUERTO}`);
});
