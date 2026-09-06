import * as cheerio from 'cheerio';
import {
  absolutizar, esRuido, fusionar, htmlATexto, imagenOriginal, limpiarTexto,
  mejorDeSrcset, parsearPrecio, sanearHtml, slugificar,
} from './normalize.js';

// ---------------------------------------------------------------------------
// 1) API Store de WooCommerce (/wp-json/wc/store/v1). Es la fuente mas limpia:
//    entrega titulo, descripciones e imagenes ya estructuradas.
// ---------------------------------------------------------------------------

export function productosDesdeStoreApi(items, categoria) {
  return (items || []).map((item) => {
    const imagenes = (item.images || [])
      .map((img) => imagenOriginal(img.src || ''))
      .filter(Boolean);
    return normalizarProducto({
      id: item.id ? `wc-${item.id}` : '',
      titulo: limpiarTexto(htmlATexto(item.name || '')),
      slug: item.slug || slugificar(item.name),
      url: item.permalink || '',
      sku: item.sku || '',
      descripcionCorta: htmlATexto(item.short_description || ''),
      descripcion: htmlATexto(item.description || ''),
      descripcionHtml: sanearHtml(item.description || ''),
      precioTexto: limpiarTexto(htmlATexto(item.prices?.price_html || '')) ||
        formatearPrecioApi(item.prices),
      precio: precioNumericoApi(item.prices),
      imagen: imagenes[0] || '',
      imagenes,
      categorias: (item.categories || []).map((c) => c.name).filter(Boolean),
      categoriaOrigen: categoria?.slug || '',
      fuente: 'store-api',
    });
  });
}

function precioNumericoApi(prices) {
  if (!prices?.price) return null;
  const menor = Number.parseInt(prices.minor_unit ?? 2, 10);
  const valor = Number.parseInt(prices.price, 10) / 10 ** menor;
  return Number.isFinite(valor) ? valor : null;
}

function formatearPrecioApi(prices) {
  const valor = precioNumericoApi(prices);
  if (valor === null) return '';
  const simbolo = prices?.currency_symbol || '$';
  return `${simbolo}${valor.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
}

// ---------------------------------------------------------------------------
// 2) JSON-LD incrustado (WooCommerce, Yoast y RankMath lo publican).
// ---------------------------------------------------------------------------

export function productosDesdeJsonLd(html, base) {
  const $ = cheerio.load(html);
  const encontrados = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const crudo = $(el).contents().text().trim();
    if (!crudo) return;
    let datos;
    try {
      datos = JSON.parse(crudo);
    } catch {
      return; // JSON-LD roto: se ignora en silencio, hay otras estrategias.
    }
    for (const nodo of aplanarJsonLd(datos)) {
      if (tipoIncluye(nodo['@type'], 'Product')) encontrados.push(nodo);
    }
  });
  return encontrados.map((nodo) => {
    const imagenes = [nodo.image]
      .flat()
      .map((img) => (typeof img === 'string' ? img : img?.url))
      .map((u) => imagenOriginal(absolutizar(u, base)))
      .filter(Boolean);
    const oferta = [nodo.offers].flat().filter(Boolean)[0] || {};
    const precio = Number.parseFloat(oferta.price ?? oferta.lowPrice ?? '');
    return normalizarProducto({
      id: nodo.sku ? `ld-${nodo.sku}` : '',
      titulo: limpiarTexto(String(nodo.name || '')),
      slug: slugificar(nodo.name),
      url: absolutizar(nodo.url || nodo['@id'] || '', base),
      sku: String(nodo.sku || ''),
      descripcion: htmlATexto(String(nodo.description || '')),
      descripcionHtml: sanearHtml(String(nodo.description || '')),
      precio: Number.isFinite(precio) ? precio : null,
      precioTexto: Number.isFinite(precio)
        ? `${oferta.priceCurrency === 'MXN' ? '$' : ''}${precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
        : '',
      imagen: imagenes[0] || '',
      imagenes,
      marca: typeof nodo.brand === 'string' ? nodo.brand : nodo.brand?.name || '',
      fuente: 'json-ld',
    });
  });
}

function aplanarJsonLd(nodo, salida = []) {
  if (Array.isArray(nodo)) {
    for (const hijo of nodo) aplanarJsonLd(hijo, salida);
    return salida;
  }
  if (nodo && typeof nodo === 'object') {
    salida.push(nodo);
    if (nodo['@graph']) aplanarJsonLd(nodo['@graph'], salida);
    if (nodo.itemListElement) aplanarJsonLd(nodo.itemListElement, salida);
    if (nodo.item) aplanarJsonLd(nodo.item, salida);
  }
  return salida;
}

function tipoIncluye(tipo, buscado) {
  return [tipo].flat().filter(Boolean).some((t) => String(t).endsWith(buscado));
}

// ---------------------------------------------------------------------------
// 3) HTML de la rejilla: WooCommerce clasico y, si no, cualquier tarjeta
//    que combine un enlace, una imagen y un titulo (Elementor, temas propios).
// ---------------------------------------------------------------------------

const SELECTORES_TARJETA = [
  'li.product',
  '.products .product',
  '.wc-block-grid__product',
  '.elementor-loop-container > *',
  '.product-item',
];

export function productosDesdeHtml(html, base, categoria) {
  const $ = cheerio.load(html);
  let tarjetas = $();
  for (const selector of SELECTORES_TARJETA) {
    tarjetas = $(selector);
    if (tarjetas.length) break;
  }
  if (!tarjetas.length) tarjetas = tarjetasHeuristicas($, base);

  const productos = [];
  tarjetas.each((_, el) => {
    const tarjeta = $(el);
    const producto = productoDeTarjeta($, tarjeta, base, categoria);
    if (producto) productos.push(producto);
  });
  return deduplicar(productos);
}

// Sin marcado de tienda: agrupa por el ancestro comun de <a> con imagen.
function tarjetasHeuristicas($, base) {
  const candidatos = new Set();
  $('a').each((_, a) => {
    const enlace = $(a);
    const href = absolutizar(enlace.attr('href') || '', base);
    if (!href || !enlace.find('img').length) return;
    const contenedor = enlace.closest('article, li, .card, .col, div');
    if (contenedor.length) candidatos.add(contenedor[0]);
  });
  return $(Array.from(candidatos));
}

function productoDeTarjeta($, tarjeta, base, categoria) {
  const enlace = tarjeta.find('a[href]').first();
  const url = absolutizar(enlace.attr('href') || '', base);

  const tituloCrudo =
    primeroPorPrioridad(tarjeta, $, [
      '.woocommerce-loop-product__title',
      '.wc-block-grid__product-title',
      '.product-title',
      '.entry-title',
      'h1', 'h2', 'h3', 'h4',
    ]).text() ||
    tarjeta.find('img').first().attr('alt') ||
    enlace.attr('title') ||
    '';
  const titulo = limpiarTexto(tituloCrudo);
  if (!titulo || esRuido(titulo)) return null;

  const img = tarjeta.find('img').first();
  const src =
    mejorDeSrcset(img.attr('srcset') || img.attr('data-srcset')) ||
    img.attr('data-src') ||
    img.attr('data-lazy-src') ||
    img.attr('src') ||
    '';
  const imagen = imagenOriginal(absolutizar(src, base));

  const precioTexto = limpiarTexto(
    tarjeta.find('.price, .woocommerce-Price-amount, .wc-block-grid__product-price').first().text(),
  );
  const { valor } = parsearPrecio(precioTexto);

  const descripcionCorta = limpiarTexto(
    tarjeta
      .find('.woocommerce-product-details__short-description, .product-short-description, .descripcion, p')
      .first()
      .text(),
  );

  return normalizarProducto({
    titulo,
    slug: slugificar(titulo),
    url,
    imagen,
    imagenes: imagen ? [imagen] : [],
    precioTexto,
    precio: valor,
    descripcionCorta: esRuido(descripcionCorta) || descripcionCorta === titulo ? '' : descripcionCorta,
    categoriaOrigen: categoria?.slug || '',
    fuente: 'html',
  });
}

// ---------------------------------------------------------------------------
// 4) Ficha individual: descripcion larga, galeria y ficha tecnica.
// ---------------------------------------------------------------------------

export function detalleDesdeHtml(html, base) {
  const $ = cheerio.load(html);

  const bloqueLargo = primeroPorPrioridad($.root(), $, [
    '#tab-description',
    '.woocommerce-Tabs-panel--description',
    '.entry-content',
    '.elementor-widget-theme-post-content',
    '.woocommerce-product-details__short-description',
  ]);
  const descripcionHtml = sanearHtml(bloqueLargo.html() || '');
  const descripcion = htmlATexto(bloqueLargo.html() || '');

  const corta = htmlATexto(
    $('.woocommerce-product-details__short-description').first().html() || '',
  );

  const imagenes = [];
  $('.woocommerce-product-gallery__image img, .wp-post-image, .flex-control-thumbs img').each((_, el) => {
    const img = $(el);
    const src =
      img.attr('data-large_image') ||
      mejorDeSrcset(img.attr('srcset') || img.attr('data-srcset')) ||
      img.attr('data-src') ||
      img.attr('src') ||
      '';
    const url = imagenOriginal(absolutizar(src, base));
    if (url) imagenes.push(url);
  });

  const precioTexto = limpiarTexto($('.summary .price, .price').first().text());
  const { valor } = parsearPrecio(precioTexto);

  const atributos = {};
  $('.woocommerce-product-attributes tr, .shop_attributes tr').each((_, tr) => {
    const fila = $(tr);
    const clave = limpiarTexto(fila.find('th').first().text());
    const dato = limpiarTexto(fila.find('td').first().text());
    if (clave && dato) atributos[clave] = dato;
  });

  const desdeJsonLd = productosDesdeJsonLd(html, base)[0] || {};

  return fusionar(
    {
      titulo: limpiarTexto($('h1.product_title, h1.entry-title, h1').first().text()),
      sku: limpiarTexto($('.sku').first().text()),
      descripcion,
      descripcionHtml,
      descripcionCorta: corta,
      imagenes: [...new Set(imagenes)],
      imagen: imagenes[0] || '',
      precioTexto,
      precio: valor,
      atributos: Object.keys(atributos).length ? atributos : undefined,
    },
    desdeJsonLd,
  );
}

// Devuelve el primer selector de la lista que exista. A diferencia de un
// selector combinado, respeta la prioridad dada y no el orden del documento.
function primeroPorPrioridad(contexto, $, selectores) {
  for (const selector of selectores) {
    const encontrado = contexto.find(selector).first();
    if (encontrado.length) return encontrado;
  }
  return $();
}

// ---------------------------------------------------------------------------
// Utilidades comunes
// ---------------------------------------------------------------------------

export function normalizarProducto(parcial) {
  const titulo = limpiarTexto(parcial.titulo || '');
  const imagenes = [...new Set((parcial.imagenes || []).filter(Boolean))];
  return {
    id: parcial.id || slugificar(titulo),
    titulo,
    slug: parcial.slug || slugificar(titulo),
    url: parcial.url || '',
    sku: parcial.sku || '',
    marca: parcial.marca || '',
    descripcionCorta: parcial.descripcionCorta || '',
    descripcion: parcial.descripcion || '',
    descripcionHtml: parcial.descripcionHtml || '',
    precio: parcial.precio ?? null,
    precioTexto: parcial.precioTexto || '',
    imagen: parcial.imagen || imagenes[0] || '',
    imagenes,
    imagenLocal: parcial.imagenLocal || '',
    imagenesLocales: parcial.imagenesLocales || [],
    categorias: parcial.categorias || [],
    categoriaOrigen: parcial.categoriaOrigen || '',
    atributos: parcial.atributos || {},
    fuente: parcial.fuente || '',
  };
}

// Une por URL de ficha; si no hay, por slug del titulo.
export function deduplicar(productos) {
  const mapa = new Map();
  for (const producto of productos) {
    if (!producto?.titulo) continue;
    const clave = producto.url || producto.slug;
    mapa.set(clave, mapa.has(clave) ? fusionar(mapa.get(clave), producto) : producto);
  }
  return [...mapa.values()];
}
