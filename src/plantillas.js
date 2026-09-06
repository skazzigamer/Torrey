// Plantillas HTML del catalogo. Sin dependencias: solo cadenas.

export function escapar(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function documento({ titulo, descripcion, prefijo = '', cuerpo, extra = '' }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapar(titulo)}</title>
<meta name="description" content="${escapar(descripcion)}">
<link rel="stylesheet" href="${prefijo}assets/estilos.css">
</head>
<body>
${cuerpo}
${extra}
</body>
</html>
`;
}

function rutaImagen(producto, prefijo) {
  if (producto.imagenLocal) return `${prefijo}${producto.imagenLocal}`;
  return producto.imagen || '';
}

function tarjeta(producto, prefijo) {
  const imagen = rutaImagen(producto, prefijo);
  const resumen = producto.descripcionCorta || producto.descripcion || '';
  return `      <article class="tarjeta" data-categoria="${escapar(producto.categoriaOrigen)}" data-busqueda="${escapar(
    `${producto.titulo} ${producto.sku} ${resumen}`.toLowerCase(),
  )}">
        <a class="tarjeta__enlace" href="${prefijo}producto/${escapar(producto.slug)}.html">
          <div class="tarjeta__medio">
            ${
              imagen
                ? `<img src="${escapar(imagen)}" alt="${escapar(producto.titulo)}" loading="lazy" decoding="async">`
                : '<span class="tarjeta__sinimagen">Sin imagen</span>'
            }
          </div>
          <div class="tarjeta__cuerpo">
            <h2 class="tarjeta__titulo">${escapar(producto.titulo)}</h2>
            ${producto.sku ? `<p class="tarjeta__sku">${escapar(producto.sku)}</p>` : ''}
            ${resumen ? `<p class="tarjeta__resumen">${escapar(recortar(resumen, 160))}</p>` : ''}
            ${producto.precioTexto ? `<p class="tarjeta__precio">${escapar(producto.precioTexto)}</p>` : ''}
          </div>
        </a>
      </article>`;
}

function recortar(texto, largo) {
  const limpio = String(texto).replace(/\s+/g, ' ').trim();
  return limpio.length > largo ? `${limpio.slice(0, largo - 1).trimEnd()}…` : limpio;
}

export function paginaIndice({ marca, categorias, productos }) {
  const filtros = [{ slug: '', nombre: 'Todos' }, ...categorias]
    .map(
      (c, i) =>
        `<button class="filtro${i === 0 ? ' filtro--activo' : ''}" data-filtro="${escapar(c.slug)}" type="button">${escapar(
          c.nombre,
        )}</button>`,
    )
    .join('\n        ');

  const cuerpo = `<header class="encabezado">
  <div class="contenedor">
    <h1 class="encabezado__titulo">${escapar(marca.nombre)}</h1>
    <p class="encabezado__sub">${escapar(marca.descripcion)}</p>
  </div>
</header>

<main class="contenedor">
  <section class="controles">
    <label class="buscador">
      <span class="visualmente-oculto">Buscar producto</span>
      <input id="buscar" type="search" placeholder="Buscar por nombre, modelo o clave..." autocomplete="off">
    </label>
    <div class="filtros">
        ${filtros}
    </div>
    <p class="conteo"><span id="conteo">${productos.length}</span> productos</p>
  </section>

  <section class="rejilla" id="rejilla">
${productos.map((p) => tarjeta(p, '')).join('\n')}
  </section>

  <p class="vacio" id="vacio" hidden>No se encontraron productos con ese criterio.</p>
</main>

<footer class="pie">
  <div class="contenedor">
    <p>${escapar(marca.nombre)}${marca.telefono ? ` · Tel. ${escapar(marca.telefono)}` : ''}${
      marca.correo ? ` · ${escapar(marca.correo)}` : ''
    }</p>
  </div>
</footer>`;

  return documento({
    titulo: marca.nombre,
    descripcion: marca.descripcion,
    cuerpo,
    extra: '<script src="assets/app.js" defer></script>',
  });
}

export function paginaProducto({ marca, producto }) {
  const prefijo = '../';
  const galeria = (producto.imagenesLocales.length ? producto.imagenesLocales.map((i) => prefijo + i) : producto.imagenes)
    .filter(Boolean);
  const principal = galeria[0] || '';

  const atributos = Object.entries(producto.atributos || {});
  const cuerpo = `<header class="encabezado encabezado--compacto">
  <div class="contenedor">
    <a class="volver" href="${prefijo}index.html">← Volver al catálogo</a>
  </div>
</header>

<main class="contenedor ficha">
  <div class="ficha__medio">
    ${
      principal
        ? `<img id="imagen-principal" src="${escapar(principal)}" alt="${escapar(producto.titulo)}">`
        : '<div class="tarjeta__sinimagen">Sin imagen</div>'
    }
    ${
      galeria.length > 1
        ? `<div class="miniaturas">${galeria
            .map(
              (img, i) =>
                `<button type="button" class="miniatura${i === 0 ? ' miniatura--activa' : ''}" data-imagen="${escapar(
                  img,
                )}"><img src="${escapar(img)}" alt="${escapar(`${producto.titulo} ${i + 1}`)}" loading="lazy"></button>`,
            )
            .join('')}</div>`
        : ''
    }
  </div>

  <div class="ficha__datos">
    <h1>${escapar(producto.titulo)}</h1>
    ${producto.sku ? `<p class="ficha__sku">Clave: ${escapar(producto.sku)}</p>` : ''}
    ${producto.precioTexto ? `<p class="ficha__precio">${escapar(producto.precioTexto)}</p>` : ''}
    ${producto.descripcionCorta ? `<p class="ficha__resumen">${escapar(producto.descripcionCorta)}</p>` : ''}
    ${
      atributos.length
        ? `<table class="ficha__tabla"><tbody>${atributos
            .map(([k, v]) => `<tr><th>${escapar(k)}</th><td>${escapar(v)}</td></tr>`)
            .join('')}</tbody></table>`
        : ''
    }
    ${
      producto.descripcionHtml
        ? `<div class="ficha__descripcion">${producto.descripcionHtml}</div>`
        : producto.descripcion
          ? `<div class="ficha__descripcion"><p>${escapar(producto.descripcion).replace(/\n/g, '<br>')}</p></div>`
          : ''
    }
    ${
      marca.whatsapp
        ? `<a class="boton" href="https://wa.me/${escapar(marca.whatsapp)}?text=${encodeURIComponent(
            `Hola, me interesa: ${producto.titulo}`,
          )}" target="_blank" rel="noopener">Cotizar por WhatsApp</a>`
        : ''
    }
  </div>
</main>

<footer class="pie">
  <div class="contenedor"><p>${escapar(marca.nombre)}</p></div>
</footer>`;

  return documento({
    titulo: `${producto.titulo} · ${marca.nombre}`,
    descripcion: recortar(producto.descripcionCorta || producto.descripcion || producto.titulo, 155),
    prefijo,
    cuerpo,
    extra: '<script src="../assets/ficha.js" defer></script>',
  });
}
