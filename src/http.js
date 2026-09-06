import { RED } from './config.js';

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

let ultimaPeticion = 0;

// Espacia las peticiones para no golpear el servidor de origen.
async function esperarTurno() {
  const transcurrido = Date.now() - ultimaPeticion;
  const falta = RED.esperaEntrePeticionesMs - transcurrido;
  if (falta > 0) await dormir(falta);
  ultimaPeticion = Date.now();
}

// GET con reintentos y retroceso exponencial (2s, 4s, 8s, 16s).
async function pedir(url, { binario = false } = {}) {
  let ultimoError;
  for (let intento = 0; intento <= RED.reintentos; intento++) {
    if (intento > 0) await dormir(2000 * 2 ** (intento - 1));
    await esperarTurno();
    try {
      const respuesta = await fetch(url, {
        headers: {
          'User-Agent': RED.userAgent,
          Accept: binario
            ? 'image/avif,image/webp,image/*,*/*;q=0.8'
            : 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
          'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8',
        },
        signal: AbortSignal.timeout(RED.tiempoLimiteMs),
        redirect: 'follow',
      });
      // 404/410 no se reintentan: la ruta simplemente no existe.
      if (respuesta.status === 404 || respuesta.status === 410) {
        const e = new Error(`HTTP ${respuesta.status} en ${url}`);
        e.codigo = respuesta.status;
        e.definitivo = true;
        throw e;
      }
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status} en ${url}`);
      return respuesta;
    } catch (error) {
      if (error.definitivo) throw error;
      ultimoError = error;
    }
  }
  throw ultimoError;
}

export async function obtenerTexto(url) {
  const respuesta = await pedir(url);
  return await respuesta.text();
}

export async function obtenerJson(url) {
  const respuesta = await pedir(url);
  return await respuesta.json();
}

export async function obtenerBinario(url) {
  const respuesta = await pedir(url, { binario: true });
  const buffer = Buffer.from(await respuesta.arrayBuffer());
  return { buffer, tipo: respuesta.headers.get('content-type') || '' };
}
