import * as cheerio from 'cheerio';

// Ruido tipico de las tarjetas de WooCommerce que no forma parte de la ficha.
const RUIDO = [
  /^a[ñn]adir al carrito$/i,
  /^agregar al carrito$/i,
  /^leer m[áa]s$/i,
  /^ver producto$/i,
  /^seleccionar opciones$/i,
  /^cotizar$/i,
];

export function esRuido(texto) {
  const t = (texto || '').trim();
  return !t || RUIDO.some((r) => r.test(t));
}

// Convierte HTML a texto plano legible, conservando saltos de parrafo.
export function htmlATexto(html) {
  if (!html) return '';
  const $ = cheerio.load(`<div id="raiz">${html}</div>`);
  $('#raiz script, #raiz style').remove();
  $('#raiz br').replaceWith('\n');
  $('#raiz p, #raiz li, #raiz div, #raiz tr').each((_, el) => {
    $(el).append('\n');
  });
  $('#raiz li').each((_, el) => {
    $(el).prepend('• ');
  });
  return limpiarTexto($('#raiz').text());
}

export function limpiarTexto(texto) {
  return (texto || '')
    .replace(/ /g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Deja solo etiquetas seguras: la descripcion larga se inyecta como HTML.
export function sanearHtml(html) {
  if (!html) return '';
  const permitidas = new Set([
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li',
    'h2', 'h3', 'h4', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span',
  ]);
  const $ = cheerio.load(`<div id="raiz">${html}</div>`);
  $('#raiz script, #raiz style, #raiz iframe, #raiz form, #raiz noscript').remove();
  $('#raiz *').each((_, el) => {
    const nombre = el.tagName?.toLowerCase();
    if (!permitidas.has(nombre)) {
      $(el).replaceWith($(el).html() || $(el).text() || '');
      return;
    }
    // Sin atributos: nada de estilos ni handlers heredados del origen.
    el.attribs = {};
  });
  return limpiarTexto($('#raiz').html() || '').replace(/\n+/g, '\n');
}

export function slugificar(texto) {
  return (texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'producto';
}

// De un srcset toma la variante de mayor ancho.
export function mejorDeSrcset(srcset) {
  if (!srcset) return '';
  const candidatos = srcset
    .split(',')
    .map((parte) => parte.trim().split(/\s+/))
    .filter((p) => p[0])
    .map(([url, medida]) => ({
      url,
      ancho: medida && medida.endsWith('w') ? parseInt(medida, 10) : 0,
    }));
  if (!candidatos.length) return '';
  candidatos.sort((a, b) => b.ancho - a.ancho);
  return candidatos[0].url;
}

// WooCommerce sirve miniaturas con sufijo -300x300; pedimos el original.
export function imagenOriginal(url) {
  if (!url) return '';
  return url.replace(/-\d{2,4}x\d{2,4}(?=\.(jpe?g|png|webp|avif|gif)(\?|$))/i, '');
}

export function absolutizar(url, base) {
  if (!url) return '';
  try {
    return new URL(url, base).toString();
  } catch {
    return '';
  }
}

// "$ 12,345.00 MXN" -> { texto, valor }
export function parsearPrecio(texto) {
  const limpio = limpiarTexto(texto).replace(/\s+/g, ' ');
  if (!limpio) return { texto: '', valor: null };
  const numero = limpio.match(/(\d[\d.,]*)/);
  if (!numero) return { texto: limpio, valor: null };
  const crudo = numero[1];
  // Si hay coma y punto, la ultima ocurrencia manda como separador decimal.
  const ultimaComa = crudo.lastIndexOf(',');
  const ultimoPunto = crudo.lastIndexOf('.');
  let normalizado;
  if (ultimaComa > ultimoPunto) {
    normalizado = crudo.replace(/\./g, '').replace(',', '.');
  } else {
    normalizado = crudo.replace(/,/g, '');
  }
  const valor = Number.parseFloat(normalizado);
  return { texto: limpio, valor: Number.isFinite(valor) ? valor : null };
}

function esObjetoPlano(valor) {
  return !!valor && typeof valor === 'object' && !Array.isArray(valor);
}

// Une varias extracciones del mismo producto sin perder lo ya encontrado.
export function fusionar(base, extra) {
  const salida = { ...base };
  for (const [clave, valor] of Object.entries(extra || {})) {
    if (valor === null || valor === undefined || valor === '') continue;
    if (Array.isArray(valor)) {
      const previo = Array.isArray(salida[clave]) ? salida[clave] : [];
      salida[clave] = [...new Set([...previo, ...valor])].filter(Boolean);
      continue;
    }
    // Objetos planos (atributos de la ficha tecnica) se combinan clave a clave.
    if (esObjetoPlano(valor)) {
      salida[clave] = { ...(esObjetoPlano(salida[clave]) ? salida[clave] : {}), ...valor };
      continue;
    }
    const actual = salida[clave];
    const vacio = actual === null || actual === undefined || actual === '' ||
      (Array.isArray(actual) && actual.length === 0);
    // Una descripcion mas completa gana sobre una mas corta.
    if (vacio || (typeof valor === 'string' && typeof actual === 'string' && valor.length > actual.length)) {
      salida[clave] = valor;
    }
  }
  return salida;
}
