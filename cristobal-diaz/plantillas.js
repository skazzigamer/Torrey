// Plantillas HTML del sitio. Sin dependencias: solo cadenas.
// Cada pagina recibe `ctx` (contenido + datos de la compilacion) y devuelve el documento completo.

export function escapar(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// *texto* se muestra en cursiva. Se escapa antes, asi el contenido nunca inyecta HTML.
export function enriquecer(texto) {
  return escapar(texto).replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

// Version sin marcas, para <title>, metas y JSON-LD.
export function plano(texto) {
  return String(texto ?? '').replace(/\*/g, '');
}

export function enlaceWhatsApp(numero, mensaje = '') {
  const digitos = String(numero ?? '').replace(/\D/g, '');
  if (!digitos) return '';
  return `https://wa.me/${digitos}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`;
}

// Telefono en formato internacional para tel: y JSON-LD. Diez digitos se toman como numero de Mexico.
export function telefonoInternacional(contacto) {
  let digitos = String(contacto.telefono || contacto.whatsapp || '').replace(/\D/g, '');
  if (!digitos) return '';
  if (digitos.length === 13 && digitos.startsWith('521')) digitos = `52${digitos.slice(3)}`;
  return `+${digitos.length === 10 ? `52${digitos}` : digitos}`;
}

function telefonoVisible(contacto) {
  if (contacto.telefono) return contacto.telefono;
  const diez = String(contacto.whatsapp || '').replace(/\D/g, '').slice(-10);
  return diez.length === 10 ? `${diez.slice(0, 2)} ${diez.slice(2, 6)} ${diez.slice(6)}` : contacto.whatsapp;
}

export function fechaLarga(iso) {
  const [anio, mes, dia] = String(iso || '').split('-').map(Number);
  if (!anio || !mes || !dia) return '';
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(anio, mes - 1, dia)),
  );
}

// Mismo formato que pedido.js en el navegador: $1,800 o $1,800.50.
export function formatoPrecio(valor, moneda = 'MXN') {
  const entero = Number.isInteger(valor);
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: entero ? 0 : 2,
    maximumFractionDigits: entero ? 0 : 2,
  }).format(valor);
}

const json = (objeto) => JSON.stringify(objeto).replace(/</g, '\\u003c');
const nombreSitio = ({ marca }) => `${marca.nombre} · ${marca.submarca}`;
const numero = (i) => String(i + 1).padStart(2, '0');

// Flor de seis petalos del logotipo, redibujada como un solo trazo sobre el archivo oficial.
const FLOR =
  'M-2.73 -4.5C-3.78 -6.24 -6.09 -8.2 -6.09 -10.2C-6.09 -13.4 -3.36 -16 0 -16' +
  'C3.36 -16 6.09 -13.4 6.09 -10.2C6.09 -8.2 3.78 -6.24 2.73 -4.5C3.78 -6.24 4.41 -9.12 6.23 -10.12' +
  'C9.14 -11.72 12.87 -10.77 14.55 -8C16.23 -5.23 15.23 -1.68 12.32 -0.08C10.5 0.92 7.56 0 5.46 0' +
  'C7.56 0 10.5 -0.92 12.32 0.08C15.23 1.68 16.23 5.23 14.55 8C12.87 10.77 9.14 11.72 6.23 10.12' +
  'C4.41 9.12 3.78 6.24 2.73 4.5C3.78 6.24 6.09 8.2 6.09 10.2C6.09 13.4 3.36 16 0 16' +
  'C-3.36 16 -6.09 13.4 -6.09 10.2C-6.09 8.2 -3.78 6.24 -2.73 4.5C-3.78 6.24 -4.41 9.12 -6.23 10.12' +
  'C-9.14 11.72 -12.87 10.77 -14.55 8C-16.23 5.23 -15.23 1.68 -12.32 0.08C-10.5 -0.92 -7.56 0 -5.46 0' +
  'C-7.56 0 -10.5 0.92 -12.32 -0.08C-15.23 -1.68 -16.23 -5.23 -14.55 -8' +
  'C-12.87 -10.77 -9.14 -11.72 -6.23 -10.12C-4.41 -9.12 -3.78 -6.24 -2.73 -4.5Z';

function flor(clase = '') {
  return `<svg class="flor${clase ? ` ${clase}` : ''}" viewBox="-17 -17 34 34" aria-hidden="true" focusable="false"><path d="${FLOR}"/></svg>`;
}

const FLECHA =
  '<svg class="flecha" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 12h17m-6-6 6 6-6 6"/></svg>';

const CHEVRON =
  '<svg class="chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg>';

const CERRAR =
  '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg>';

const OPCIONAL = '<span class="campo__opcional">(opcional)</span>';

const icono = (contenido) => `<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${contenido}</svg>`;

const ICONOS = {
  whatsapp: icono(
    '<path class="icono__relleno" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.23-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41Z"/>',
  ),
  telefono: icono(
    '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  ),
  correo: icono('<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/>'),
  instagram: icono(
    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle class="icono__relleno" cx="17.4" cy="6.6" r="1.1"/>',
  ),
  facebook: icono(
    '<path class="icono__relleno" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.46a21 21 0 0 0-2.33-.12c-2.3 0-3.87 1.4-3.87 3.98v2.18H7.8v3h2.6V21h3.1Z"/>',
  ),
  ubicacion: icono('<path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  reloj: icono('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  bolsa: icono('<path d="M5.5 8h13l-1.1 12.5H6.6Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),
};

// Ilustraciones de linea que ocupan el lugar de las fotos mientras el cliente las envia.
const ILUSTRACIONES = {
  plato: `<svg class="ilustracion" viewBox="0 0 400 500" aria-hidden="true" focusable="false">
  <circle cx="200" cy="250" r="118"/><circle class="ilustracion__tenue" cx="200" cy="250" r="86"/>
  <path d="M52 152v44M60 152v44M68 152v44M76 152v44M52 196c0 13 6 20 12 20s12-7 12-20M64 216v134"/>
  <path d="M336 152c13 10 16 40 12 76h-12Zm6 76v122"/>
  <path class="ilustracion__flor" transform="translate(200 250) scale(2.3)" d="${FLOR}"/>
</svg>`,
  pastel: `<svg class="ilustracion" viewBox="0 0 400 500" aria-hidden="true" focusable="false">
  <path d="M92 382h216M200 382v36M166 420h68"/>
  <rect x="116" y="302" width="168" height="80" rx="3"/>
  <path class="ilustracion__tenue" d="M116 318q14 14 28 0t28 0 28 0 28 0 28 0 28 0"/>
  <rect x="148" y="238" width="104" height="64" rx="3"/>
  <path class="ilustracion__tenue" d="M148 252q13 12 26 0t26 0 26 0 26 0"/>
  <path class="ilustracion__flor" transform="translate(200 214) scale(1.15)" d="${FLOR}"/>
</svg>`,
  batidor: `<svg class="ilustracion" viewBox="0 0 400 500" aria-hidden="true" focusable="false">
  <path d="M200 312C132 232 138 104 200 84c62 20 68 148 0 228Z"/>
  <path class="ilustracion__tenue" d="M200 312c-40-76-38-202 0-228 38 26 40 152 0 228Z"/>
  <path class="ilustracion__tenue" d="M200 312c-14-72-14-200 0-228 14 28 14 156 0 228Z"/>
  <path d="M182 312h36"/>
  <rect x="190" y="312" width="20" height="112" rx="10"/>
  <path class="ilustracion__flor" transform="translate(200 456) scale(.7)" d="${FLOR}"/>
</svg>`,
  cheesecake: `<svg class="ilustracion" viewBox="0 0 400 500" aria-hidden="true" focusable="false">
  <path d="M46 208 259 120q53 12 68 43v81L46 295Z"/>
  <path class="ilustracion__tenue" d="M46 208 327 163M46 271 327 220"/>
  <circle cx="305" cy="333" r="53"/>
  <circle class="ilustracion__tenue" cx="305" cy="333" r="43"/>
  <path class="ilustracion__tenue" d="M286 314h7m19-7h6m9 24h6m-38 14h7m14 12h6m-41-24h5"/>
  <path class="ilustracion__flor" transform="translate(211 160) scale(1.02)" d="${FLOR}"/>
</svg>`,
  caja: `<svg class="ilustracion" viewBox="0 0 400 500" aria-hidden="true" focusable="false">
  <rect x="122" y="238" width="156" height="148" rx="3"/>
  <rect x="110" y="204" width="180" height="34" rx="3"/>
  <path class="ilustracion__tenue" d="M192 204v182M208 204v182"/>
  <path d="M200 204c-18-34-60-42-58-14 2 20 38 18 58 14Zm0 0c18-34 60-42 58-14-2 20-38 18-58 14Z"/>
  <circle class="ilustracion__sello" cx="200" cy="312" r="23"/>
  <path class="ilustracion__flor" transform="translate(200 312) scale(.95)" d="${FLOR}"/>
</svg>`,
};

// ——— Piezas comunes ———

function datosContacto(ctx) {
  const { contacto, marca } = ctx;
  const datos = [];
  const whatsapp = enlaceWhatsApp(contacto.whatsapp);
  if (whatsapp) {
    datos.push({ clave: 'whatsapp', etiqueta: 'WhatsApp', texto: telefonoVisible(contacto), href: whatsapp, externo: true });
  }
  if (contacto.telefono) {
    datos.push({ clave: 'telefono', etiqueta: 'Teléfono', texto: contacto.telefono, href: `tel:${telefonoInternacional(contacto)}` });
  }
  if (contacto.correo) {
    datos.push({ clave: 'correo', etiqueta: 'Correo', texto: contacto.correo, href: `mailto:${contacto.correo}` });
  }
  if (contacto.instagram) {
    const usuario = contacto.instagram.replace(/^@/, '');
    datos.push({
      clave: 'instagram',
      etiqueta: 'Instagram',
      texto: `@${usuario}`,
      href: `https://www.instagram.com/${usuario}/`,
      externo: true,
    });
  }
  if (contacto.facebook) {
    datos.push({ clave: 'facebook', etiqueta: 'Facebook', texto: 'Facebook', href: contacto.facebook, externo: true });
  }
  if (marca.ciudad) datos.push({ clave: 'ubicacion', etiqueta: 'Ubicación', texto: marca.ciudad });
  if (contacto.horario) datos.push({ clave: 'reloj', etiqueta: 'Horario', texto: contacto.horario });
  return datos;
}

function datoContacto(dato) {
  // Los telefonos llevan espacios de no separacion para no partirse entre dos lineas.
  const visible = ['whatsapp', 'telefono'].includes(dato.clave) ? dato.texto.replace(/ /g, '\u00a0') : dato.texto;
  const texto = `${ICONOS[dato.clave] || ''}<span>${escapar(visible)}</span>`;
  if (!dato.href) return `<span class="dato">${texto}</span>`;
  const externo = dato.externo ? ' target="_blank" rel="noopener"' : '';
  const nombre = dato.texto === dato.etiqueta ? dato.etiqueta : `${dato.etiqueta}: ${dato.texto}`;
  return `<a class="dato" href="${escapar(dato.href)}"${externo} aria-label="${escapar(nombre)}">${texto}</a>`;
}

function botonWhatsApp(ctx, mensaje, clase = 'boton--claro', texto = 'Escribir por WhatsApp') {
  const href = enlaceWhatsApp(ctx.contacto.whatsapp, mensaje);
  if (!href) return '';
  return `<a class="boton ${clase}" href="${escapar(href)}" target="_blank" rel="noopener">${ICONOS.whatsapp}<span>${escapar(texto)}</span></a>`;
}

// Logotipo: la matriz lleva la flor; una sub-marca, su linea entre rayas (como el logo de cheesecake).
function lockup(ctx, { linea = '', clase = '', etiqueta = 'div', atributos = '' } = {}) {
  const clases = ['lockup', linea ? 'lockup--linea' : '', clase].filter(Boolean).join(' ');
  return `<${etiqueta} class="${clases}"${atributos}>
      <span class="lockup__nombre">${escapar(ctx.marca.nombre)}</span>
      <span class="lockup__sub">${escapar(ctx.marca.submarca)}</span>
      ${linea ? `<span class="lockup__linea"><span>${escapar(linea)}</span></span>` : flor('lockup__flor')}
    </${etiqueta}>`;
}

function encabezado({ antetitulo, titulo, texto, id, centrado = false }) {
  return `<header class="encabezado${centrado ? ' encabezado--centrado' : ''}" data-revelar>
      ${antetitulo ? `<p class="antetitulo">${escapar(antetitulo)}</p>` : ''}
      <h2 class="titulo" id="${id}">${enriquecer(titulo)}</h2>
      ${texto ? `<p class="entrada">${enriquecer(texto)}</p>` : ''}
    </header>`;
}

function marco(ctx, { imagen, imagenAlt, ilustracion = 'plato' }) {
  if (imagen) {
    return `<figure class="marco" data-revelar><img src="${ctx.prefijo}assets/img/${escapar(imagen)}" alt="${escapar(
      imagenAlt,
    )}" loading="lazy" decoding="async"></figure>`;
  }
  return `<div class="marco marco--vacio" data-revelar aria-hidden="true">${ILUSTRACIONES[ilustracion] || ILUSTRACIONES.plato}</div>`;
}

function retrato(ctx) {
  const { chef, marca, prefijo } = ctx;
  if (chef.imagen) {
    return `<figure class="marco marco--retrato" data-revelar><img src="${prefijo}assets/img/${escapar(chef.imagen)}" alt="${escapar(
      chef.imagenAlt,
    )}" loading="lazy" decoding="async"></figure>`;
  }
  const iniciales = marca.nombre
    .split(/\s+/)
    .map((palabra) => palabra[0])
    .join('')
    .slice(0, 2);
  return `<div class="marco marco--retrato marco--vacio" data-revelar aria-hidden="true"><span class="monograma">${escapar(
    iniciales,
  )}</span>${flor('marco__flor')}</div>`;
}

function firma(ctx) {
  const { chef, marca, prefijo } = ctx;
  if (!chef.firma) return '';
  return `<img class="firma" src="${prefijo}assets/img/${escapar(chef.firma)}" alt="Firma de ${escapar(marca.nombre)}" loading="lazy">`;
}

function cierre(ctx, { titulo, texto, mensaje, servicio }) {
  const whatsapp = botonWhatsApp(ctx, mensaje, 'boton--claro');
  const destino = `${ctx.prefijo}contacto.html${servicio ? `?servicio=${encodeURIComponent(servicio)}` : ''}`;
  return `<section class="cierre" aria-labelledby="cierre-titulo">
  <div class="contenedor cierre__interior" data-revelar>
    ${flor('cierre__flor')}
    <h2 class="cierre__titulo" id="cierre-titulo">${enriquecer(titulo)}</h2>
    <p class="cierre__texto">${enriquecer(texto)}</p>
    <div class="botones botones--centrados">
      ${whatsapp}
      <a class="boton ${whatsapp ? 'boton--contorno' : 'boton--claro'}" href="${escapar(destino)}">Enviar un mensaje</a>
    </div>
  </div>
</section>`;
}

function tarjetasServicios(ctx, servicios, { compactas = false, columnas = Infinity } = {}) {
  return servicios
    .map(
      (s, i) => `<li class="rama${i >= columnas ? ' rama--abajo' : ''}" data-revelar style="--retraso:${i % columnas}">
        <a class="tarjeta${compactas ? ' tarjeta--compacta' : ''}" href="${ctx.prefijo}${s.slug}.html">
          <span class="tarjeta__num">${s.numero}</span>
          <span class="tarjeta__etiqueta">${escapar(s.etiqueta)}</span>
          <h3 class="tarjeta__nombre">${escapar(s.nombre)}</h3>
          ${compactas ? '' : `<p class="tarjeta__texto">${enriquecer(s.resumen)}</p>`}
          <span class="tarjeta__mas">Conocer más ${FLECHA}</span>
        </a>
      </li>`,
    )
    .join('\n      ');
}

const categoriaDe = (ctx, id) => ctx.tienda.categorias.find((c) => c.id === id);

function precioProducto(ctx, p, categoria) {
  if (p.precio == null) return `<span class="producto__cotizar">${escapar(categoria.sinPrecio)}</span>`;
  const unidad = [ctx.tienda.moneda, p.unidad].filter(Boolean).join(' · ');
  return `${p.desde ? '<span class="producto__desde">Desde</span> ' : ''}<span class="producto__monto">${escapar(
    formatoPrecio(p.precio, ctx.tienda.moneda),
  )}</span> <span class="producto__unidad">${escapar(unidad)}</span>`;
}

// Sin JavaScript, "Agregar" abre WhatsApp (o el formulario) con el producto; con JavaScript lo suma al pedido.
function accionesProducto(ctx, p, categoria) {
  const { contacto, prefijo } = ctx;
  const referencia = `${p.nombre}${p.fecha ? ` (${p.fecha})` : ''}`;
  const formulario = `${prefijo}contacto.html${categoria.servicio ? `?servicio=${encodeURIComponent(categoria.servicio)}` : ''}`;
  const enlace = (href, clase, texto, extra = '') =>
    `<a class="boton ${clase}" href="${escapar(href)}"${href.startsWith('https:') ? ' target="_blank" rel="noopener"' : ''}${extra}>${texto}</a>`;
  if (p.agotado) {
    const espera = enlaceWhatsApp(contacto.whatsapp, `Hola, quiero entrar a la lista de espera de: ${referencia}.`);
    return enlace(espera || formulario, 'boton--linea', 'Lista de espera');
  }
  const interes = enlaceWhatsApp(contacto.whatsapp, `Hola, me interesa: ${referencia}.`);
  const agregar = enlace(
    interes || formulario,
    'boton--oscuro',
    p.categoria === 'cursos' ? 'Apartar lugar' : 'Agregar al pedido',
    ` data-agregar="${escapar(p.id)}"`,
  );
  return p.pago ? `${agregar}${enlace(p.pago, 'boton--linea', 'Pagar en línea')}` : agregar;
}

function tarjetaProducto(ctx, p, i) {
  const categoria = categoriaDe(ctx, p.categoria);
  const detalles = [...p.detalles, p.fecha || (p.categoria === 'cursos' ? 'Fecha por anunciar' : '')];
  if (p.cupo && !p.agotado) detalles.push(`Cupo: ${p.cupo} lugares`);
  const medio = p.imagen
    ? `<img src="${ctx.prefijo}assets/img/${escapar(p.imagen)}" alt="${escapar(p.nombre)}" loading="lazy" decoding="async">`
    : ILUSTRACIONES[categoria.ilustracion] || ILUSTRACIONES.plato;
  return `<li class="producto" data-categoria="${escapar(p.categoria)}" data-revelar style="--retraso:${i % 3}">
        <div class="producto__medio${p.imagen ? '' : ' producto__medio--vacio'}">${medio}${
          p.agotado ? '<span class="producto__sello">Agotado</span>' : ''
        }</div>
        <div class="producto__cuerpo">
          <p class="producto__categoria">${escapar(categoria.singular)}</p>
          <h3 class="producto__nombre">${escapar(p.nombre)}</h3>
          ${p.resumen ? `<p class="producto__resumen">${enriquecer(p.resumen)}</p>` : ''}
          <ul class="producto__detalles">${detalles
            .filter(Boolean)
            .map((d) => `<li>${escapar(d)}</li>`)
            .join('')}</ul>
          <p class="producto__precio">${precioProducto(ctx, p, categoria)}</p>
          <div class="producto__acciones">${accionesProducto(ctx, p, categoria)}</div>
        </div>
      </li>`;
}

function listaProductos(ctx, productos, { vacio = '' } = {}) {
  if (!productos.length) {
    const escribir =
      botonWhatsApp(ctx, 'Hola, quiero información sobre los cursos y la tienda del atelier.', 'boton--oscuro') ||
      `<a class="boton boton--oscuro" href="${ctx.prefijo}contacto.html">Escríbenos</a>`;
    return `<div class="vacio" data-revelar>${flor()}<p>${enriquecer(vacio)}</p>${escribir}</div>`;
  }
  return `<ul class="productos">
      ${productos.map((p, i) => tarjetaProducto(ctx, p, i)).join('\n      ')}
    </ul>`;
}

// Lo que pedido.js necesita saber de cada producto para armar el pedido en cualquier pagina.
function datosCatalogo(ctx) {
  const productos = {};
  for (const p of ctx.catalogo) {
    if (p.agotado) continue;
    productos[p.id] = {
      nombre: p.nombre,
      precio: p.precio ?? null,
      fecha: p.fecha || '',
      unidad: p.unidad || '',
      maximo: p.cupo || 20,
      entrega: Boolean(categoriaDe(ctx, p.categoria).entrega),
    };
  }
  return json({ moneda: ctx.tienda.moneda, productos });
}

function panelPedido(ctx) {
  const { contacto, tienda, prefijo } = ctx;
  const whatsapp = String(contacto.whatsapp || '').replace(/\D/g, '');
  const botones = [
    whatsapp
      ? `<button class="boton boton--oscuro" type="submit" name="canal" value="whatsapp">${ICONOS.whatsapp}<span>Enviar pedido por WhatsApp</span></button>`
      : '',
    contacto.correo
      ? `<button class="boton ${whatsapp ? 'boton--linea' : 'boton--oscuro'}" type="submit" name="canal" value="correo">${ICONOS.correo}<span>Enviar por correo</span></button>`
      : '',
  ].filter(Boolean);
  if (!botones.length) botones.push('<button class="boton boton--oscuro" type="submit">Enviar pedido</button>');
  const condiciones = [tienda.pagos && `Formas de pago: ${tienda.pagos}`, tienda.entregas].filter(Boolean).join(' ');
  return `<dialog class="pedido" id="pedido" aria-labelledby="pedido-titulo">
  <div class="pedido__interior">
    <div class="pedido__cabecera">
      <h2 class="pedido__titulo" id="pedido-titulo">Tu <em>pedido</em></h2>
      <button class="pedido__cerrar" type="button" data-cerrar-pedido aria-label="Cerrar el pedido">${CERRAR}</button>
    </div>
    <div class="pedido__vacio">
      <p>Tu pedido está vacío.</p>
      <a class="enlace-flecha" href="${prefijo}tienda.html">Ir a la tienda ${FLECHA}</a>
    </div>
    <ul class="pedido__lineas"></ul>
    <div class="pedido__resumen">
      <p class="pedido__total"><span>Total</span> <strong data-total></strong></p>
      <p class="pedido__aclaracion" data-aclaracion></p>
    </div>
    <form class="formulario pedido__formulario" data-whatsapp="${escapar(whatsapp)}" data-correo="${escapar(contacto.correo)}">
      <div class="campo">
        <label for="p-nombre">Nombre</label>
        <input id="p-nombre" name="nombre" type="text" autocomplete="name" required>
      </div>
      <div class="campo">
        <label for="p-telefono">Teléfono ${OPCIONAL}</label>
        <input id="p-telefono" name="telefono" type="tel" autocomplete="tel" inputmode="tel">
      </div>
      <div class="campo" data-solo-entrega hidden>
        <label for="p-entrega">Entrega</label>
        <select id="p-entrega" name="entrega">
          <option>Recoger en el atelier</option>
          <option>Envío a domicilio</option>
        </select>
      </div>
      <div class="campo" data-solo-entrega hidden>
        <label for="p-fecha">Fecha deseada ${OPCIONAL}</label>
        <input id="p-fecha" name="fecha" type="date">
      </div>
      <div class="campo">
        <label for="p-notas">Notas ${OPCIONAL}</label>
        <textarea id="p-notas" name="notas" rows="3" placeholder="Sabores, dedicatoria, alergias…"></textarea>
      </div>
      <div class="formulario__acciones">
        ${botones.join('\n        ')}
      </div>
      <p class="formulario__estado" role="status" aria-live="polite"></p>
      <p class="pedido__condiciones">${escapar(
        condiciones || 'Antes de cobrar te confirmamos disponibilidad, total y forma de pago.',
      )}</p>
    </form>
    <button class="pedido__vaciar" type="button" data-vaciar-pedido>Vaciar pedido</button>
  </div>
</dialog>
<div class="aviso-pedido" role="status" aria-live="polite" hidden>
  <span data-aviso-texto></span>
  <button type="button" data-abrir-pedido>Ver pedido</button>
</div>
<script type="application/json" id="catalogo">${datosCatalogo(ctx)}</script>`;
}

function otras(ctx, servicios, { titulo, fondo = 'papel' }) {
  return `<section class="seccion seccion--${fondo} otras" aria-labelledby="otras-titulo">
  <div class="contenedor">
    <h2 class="antetitulo otras__titulo" id="otras-titulo">${escapar(titulo)}</h2>
    <ul class="otras__lista otras__lista--${servicios.length}">
      ${tarjetasServicios(ctx, servicios, { compactas: true })}
    </ul>
  </div>
</section>`;
}

function principios(ctx, fondo) {
  const { principios: datos } = ctx;
  return `<section class="seccion seccion--${fondo}" aria-labelledby="principios-titulo">
  <div class="contenedor">
    ${encabezado({ antetitulo: datos.antetitulo, titulo: datos.titulo, id: 'principios-titulo' })}
    <ul class="principios">
      ${datos.items
        .map(
          (p, i) => `<li class="principio" data-revelar style="--retraso:${i}">
        ${flor()}
        <h3 class="principio__titulo">${enriquecer(p.titulo)}</h3>
        <p class="principio__texto">${enriquecer(p.texto)}</p>
      </li>`,
        )
        .join('\n      ')}
    </ul>
  </div>
</section>`;
}

// ——— Bloques de las paginas de especialidad ———

const FONDOS = {
  catalogo: 'marfil',
  rejilla: 'marfil',
  lista: 'papel',
  pasos: 'arena',
  destacado: 'negro',
  etiquetas: 'papel',
  preguntas: 'marfil',
  nota: 'marfil',
};

const BLOQUES = {
  catalogo(b, { id, clases, ctx }) {
    const productos = ctx.catalogo.filter((p) => p.categoria === b.categoria);
    const tienda = `${ctx.prefijo}tienda.html?categoria=${encodeURIComponent(b.categoria)}`;
    return `<section class="${clases}" id="${escapar(b.categoria)}" aria-labelledby="${id}">
  <div class="contenedor">
    ${encabezado({ antetitulo: b.antetitulo, titulo: b.titulo, id })}
    ${listaProductos(ctx, productos, { vacio: b.vacio })}
    ${productos.length ? `<a class="enlace-flecha" href="${escapar(tienda)}">Ver en la tienda ${FLECHA}</a>` : ''}
  </div>
</section>`;
  },

  rejilla(b, { id, clases }) {
    const total = b.items.length;
    const columnas = total % 3 === 0 ? 3 : total % 4 === 0 ? 4 : 2;
    return `<section class="${clases}" aria-labelledby="${id}">
  <div class="contenedor">
    ${encabezado({ antetitulo: b.antetitulo, titulo: b.titulo, id })}
    <ol class="rejilla rejilla--${columnas}">
      ${b.items
        .map(
          (item, i) => `<li class="rejilla__item" data-revelar style="--retraso:${i % columnas}">
        <span class="rejilla__num">${numero(i)}</span>
        <h3 class="rejilla__titulo">${enriquecer(item.titulo)}</h3>
        <p class="rejilla__texto">${enriquecer(item.texto)}</p>
      </li>`,
        )
        .join('\n      ')}
    </ol>
  </div>
</section>`;
  },

  lista(b, { id, clases }) {
    return `<section class="${clases}" aria-labelledby="${id}">
  <div class="contenedor dividido dividido--fijo">
    ${encabezado({ antetitulo: b.antetitulo, titulo: b.titulo, id })}
    <ul class="lista" data-revelar>
      ${b.items.map((item) => `<li>${flor()}<span>${enriquecer(item)}</span></li>`).join('\n      ')}
    </ul>
  </div>
</section>`;
  },

  pasos(b, { id, clases }) {
    return `<section class="${clases}" aria-labelledby="${id}">
  <div class="contenedor">
    ${encabezado({ antetitulo: b.antetitulo, titulo: b.titulo, id })}
    <ol class="pasos pasos--${b.items.length}">
      ${b.items
        .map(
          (paso, i) => `<li class="paso" data-revelar style="--retraso:${i}">
        <span class="paso__num">${numero(i)}</span>
        <h3 class="paso__titulo">${enriquecer(paso.titulo)}</h3>
        <p class="paso__texto">${enriquecer(paso.texto)}</p>
      </li>`,
        )
        .join('\n      ')}
    </ol>
  </div>
</section>`;
  },

  destacado(b, { clases }) {
    return `<div class="${clases} destacado">
  <div class="contenedor" data-revelar>
    ${flor('destacado__flor')}
    <p class="destacado__texto">${enriquecer(b.texto)}</p>
  </div>
</div>`;
  },

  etiquetas(b, { id, clases }) {
    return `<section class="${clases}" aria-labelledby="${id}">
  <div class="contenedor dividido dividido--fijo">
    ${encabezado({ antetitulo: b.antetitulo, titulo: b.titulo, id })}
    <ul class="etiquetas" data-revelar>
      ${b.items.map((item) => `<li>${enriquecer(item)}</li>`).join('\n      ')}
    </ul>
  </div>
</section>`;
  },

  preguntas(b, { id, clases }) {
    return `<section class="${clases}" aria-labelledby="${id}">
  <div class="contenedor dividido dividido--fijo">
    ${encabezado({ antetitulo: b.antetitulo, titulo: b.titulo, id })}
    <div class="preguntas" data-revelar>
      ${b.items
        .map(
          (p) => `<details class="pregunta">
        <summary><span>${enriquecer(p.pregunta)}</span><span class="pregunta__icono" aria-hidden="true"></span></summary>
        <p class="pregunta__respuesta">${enriquecer(p.respuesta)}</p>
      </details>`,
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;
  },

  nota(b, { clases }) {
    return `<div class="${clases}">
  <div class="contenedor">
    <p class="nota" data-revelar>${flor()}<span>${enriquecer(b.texto)}</span></p>
  </div>
</div>`;
  },
};

function bloques(ctx, lista) {
  // La introduccion va sobre papel; dos secciones seguidas con el mismo fondo se separan con una linea.
  let anterior = 'papel';
  return lista
    .map((bloque, i) => {
      const dibujar = BLOQUES[bloque.tipo];
      if (!dibujar) throw new Error(`Tipo de bloque desconocido: "${bloque.tipo}"`);
      const fondo = FONDOS[bloque.tipo];
      const clases = ['seccion', `seccion--${fondo}`];
      if (bloque.tipo === 'nota') clases.push('seccion--breve');
      else if (fondo === anterior) clases.push('seccion--continua');
      if (bloque.tipo !== 'nota') anterior = fondo;
      return dibujar(bloque, { id: `bloque-${i + 1}`, clases: clases.join(' '), ctx });
    })
    .join('\n');
}

// ——— Documento ———

function cabecera(ctx, activo) {
  const { marca, servicios, prefijo } = ctx;
  const actual = (clave) => (clave === activo ? ' aria-current="page"' : '');
  const enlace = (archivo, clave, numero, texto) =>
    `<li><a class="menu__enlace" href="${prefijo}${archivo}"${actual(clave)}><span class="menu__num" aria-hidden="true">${numero}</span>${escapar(
      texto,
    )}</a></li>`;
  const especialidades = servicios.map((s) => enlace(`${s.slug}.html`, s.slug, s.numero, s.nombre)).join('\n            ');
  const enEspecialidad = servicios.some((s) => s.slug === activo);
  const rapidos = datosContacto(ctx).filter((dato) => dato.href && dato.clave !== 'telefono');
  return `<header class="cabecera${activo === 'inicio' ? ' cabecera--portada' : ''}" id="cabecera">
  <div class="contenedor cabecera__interior">
    <a class="marca lockup" href="${prefijo}index.html"${actual('inicio')}>
      <span class="lockup__nombre">${escapar(marca.nombre)}</span>
      <span class="lockup__sub">${escapar(marca.submarca)}</span>
    </a>
    <nav class="menu" id="menu" aria-label="Principal">
      <ul class="menu__lista">
        <li class="menu__grupo">
          <button class="menu__desplegar${
            enEspecialidad ? ' menu__desplegar--actual' : ''
          }" type="button" aria-expanded="false" aria-controls="submenu">Especialidades ${CHEVRON}</button>
          <ul class="submenu" id="submenu">
            ${especialidades}
          </ul>
        </li>
        ${enlace('tienda.html', 'tienda', '', 'Tienda')}
        ${enlace('chef.html', 'chef', '', 'El chef')}
      </ul>
      <a class="boton boton--contorno menu__cta" href="${prefijo}contacto.html"${actual('contacto')}>Contacto</a>
      ${
        rapidos.length
          ? `<ul class="menu__rapidos">${rapidos.map((dato) => `<li>${datoContacto(dato)}</li>`).join('')}</ul>`
          : ''
      }
    </nav>
    <button class="carrito" type="button" data-abrir-pedido aria-haspopup="dialog" aria-label="Tu pedido">${
      ICONOS.bolsa
    }<span class="carrito__cuenta" data-cuenta hidden>0</span></button>
    <button class="menu-boton" type="button" aria-expanded="false" aria-controls="menu">
      <span class="menu-boton__icono" aria-hidden="true"></span>
      <span class="visualmente-oculto">Abrir menú</span>
    </button>
  </div>
</header>`;
}

function pie(ctx) {
  const { marca, servicios, prefijo, anio } = ctx;
  const datos = datosContacto(ctx);
  return `<footer class="pie">
  <div class="contenedor pie__rejilla">
    <div class="pie__marca">
      ${lockup(ctx, { etiqueta: 'a', clase: 'lockup--pie', atributos: ` href="${prefijo}index.html"` })}
      <p class="pie__texto">${escapar(marca.descripcion)}</p>
    </div>
    <nav class="pie__columna" aria-labelledby="pie-especialidades">
      <h2 class="pie__titulo" id="pie-especialidades">Especialidades</h2>
      <ul>
        ${servicios.map((s) => `<li><a href="${prefijo}${s.slug}.html">${escapar(s.nombre)}</a></li>`).join('\n        ')}
      </ul>
    </nav>
    <nav class="pie__columna" aria-labelledby="pie-atelier">
      <h2 class="pie__titulo" id="pie-atelier">Atelier</h2>
      <ul>
        <li><a href="${prefijo}index.html">Inicio</a></li>
        <li><a href="${prefijo}tienda.html">Tienda</a></li>
        <li><a href="${prefijo}chef.html">El chef</a></li>
        <li><a href="${prefijo}contacto.html">Contacto</a></li>
      </ul>
    </nav>
    <div class="pie__columna">
      <h2 class="pie__titulo">Contacto</h2>
      <ul class="pie__contacto">
        ${datos.map((dato) => `<li>${datoContacto(dato)}</li>`).join('\n        ')}
      </ul>
    </div>
  </div>
  <div class="contenedor pie__legal">
    <p>© ${anio} ${escapar(nombreSitio(ctx))}. Todos los derechos reservados.</p>
    <a href="${prefijo}aviso-de-privacidad.html">Aviso de privacidad</a>
  </div>
</footer>`;
}

function documento(ctx, { archivo, titulo, descripcion, cuerpo, activo = '', mensaje, jsonLd, indexable = true }) {
  const { sitio, version, prefijo } = ctx;
  const url = sitio.dominio && indexable ? `${sitio.dominio}/${archivo === 'index.html' ? '' : archivo}` : '';
  const imagen = sitio.dominio ? `${sitio.dominio}/assets/img/og.jpg` : '';
  const flotante = enlaceWhatsApp(ctx.contacto.whatsapp, mensaje || ctx.portada.cierre.mensaje);
  const metas = [
    !sitio.dominio || !indexable ? '<meta name="robots" content="noindex">' : '',
    url ? `<link rel="canonical" href="${escapar(url)}">` : '',
    '<meta name="theme-color" content="#0b0b0b">',
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="es_MX">',
    `<meta property="og:site_name" content="${escapar(nombreSitio(ctx))}">`,
    `<meta property="og:title" content="${escapar(titulo)}">`,
    `<meta property="og:description" content="${escapar(descripcion)}">`,
    url ? `<meta property="og:url" content="${escapar(url)}">` : '',
    imagen ? `<meta property="og:image" content="${escapar(imagen)}">` : '',
    imagen ? '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">' : '',
    '<meta name="twitter:card" content="summary_large_image">',
  ].filter(Boolean);
  return `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapar(titulo)}</title>
<meta name="description" content="${escapar(descripcion)}">
${metas.join('\n')}
<link rel="icon" href="${prefijo}assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="${prefijo}assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${prefijo}assets/img/apple-touch-icon.png">
<link rel="preload" href="${prefijo}assets/fuentes/poppins-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${prefijo}assets/fuentes/poppins-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${prefijo}assets/fuentes/cormorant-garamond.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${prefijo}assets/estilos.css?v=${version.css}">
<script>document.documentElement.classList.add('js')</script>
<script src="${prefijo}assets/pedido.js?v=${version.pedido}" defer></script>
<script src="${prefijo}assets/sitio.js?v=${version.js}" defer></script>
${jsonLd ? `<script type="application/ld+json">${json(jsonLd)}</script>\n` : ''}</head>
<body>
<a class="saltar" href="#contenido">Saltar al contenido</a>
${cabecera(ctx, activo)}
<main id="contenido">
${cuerpo}
</main>
${pie(ctx)}
${panelPedido(ctx)}
${
  flotante
    ? `<a class="flotante" href="${escapar(flotante)}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">${ICONOS.whatsapp}</a>\n`
    : ''
}</body>
</html>
`;
}

// ——— Datos estructurados (schema.org) ———

function organizacion(ctx) {
  const { marca, contacto, sitio } = ctx;
  const redes = datosContacto(ctx)
    .filter((dato) => ['instagram', 'facebook'].includes(dato.clave))
    .map((dato) => dato.href);
  return {
    '@type': 'Organization',
    name: nombreSitio(ctx),
    alternateName: `${marca.nombre} ${marca.submarca}`,
    description: marca.descripcion,
    url: sitio.dominio ? `${sitio.dominio}/` : undefined,
    logo: sitio.dominio ? `${sitio.dominio}/assets/img/apple-touch-icon.png` : undefined,
    founder: { '@type': 'Person', name: marca.nombre, jobTitle: 'Chef' },
    areaServed: marca.ciudad || undefined,
    email: contacto.correo || undefined,
    telephone: telefonoInternacional(contacto) || undefined,
    sameAs: redes.length ? redes : undefined,
  };
}

function jsonLdInicio(ctx) {
  const { servicios, sitio } = ctx;
  return {
    '@context': 'https://schema.org',
    ...organizacion(ctx),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Especialidades',
      itemListElement: servicios.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.nombre,
          description: plano(s.resumen),
          url: sitio.dominio ? `${sitio.dominio}/${s.slug}.html` : undefined,
        },
      })),
    },
  };
}

function jsonLdServicio(ctx, s) {
  const { marca, sitio } = ctx;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.nombre,
    serviceType: s.etiqueta,
    description: s.descripcionSeo,
    url: sitio.dominio ? `${sitio.dominio}/${s.slug}.html` : undefined,
    areaServed: marca.ciudad || undefined,
    provider: organizacion(ctx),
  };
}

// ——— Paginas ———

export function paginaInicio(ctx) {
  const { marca, portada, servicios, chef, catalogo, prefijo } = ctx;
  const porSlug = new Map(servicios.map((s) => [s.slug, s]));
  const cursos = catalogo.filter((p) => p.categoria === 'cursos').slice(0, 3);
  const columnasArbol = servicios.length <= 5 ? servicios.length : Math.ceil(servicios.length / 2);
  const publico = (p) => `<div class="publico publico--${p.tono}">
    ${flor('publico__flor')}
    <div class="publico__interior" data-revelar>
      <p class="antetitulo">${escapar(p.antetitulo)}</p>
      <h2 class="publico__titulo">${enriquecer(p.titulo)}</h2>
      <p class="publico__texto">${enriquecer(p.texto)}</p>
      <ul class="publico__enlaces">
        ${p.servicios
          .map((slug) => porSlug.get(slug))
          .filter(Boolean)
          .map((s) => `<li><a href="${prefijo}${s.slug}.html"><span>${escapar(s.nombre)}</span>${FLECHA}</a></li>`)
          .join('\n        ')}
      </ul>
      <div class="botones">
        <a class="boton ${p.tono === 'oscuro' ? 'boton--claro' : 'boton--oscuro'}" href="${prefijo}${escapar(
          p.boton.archivo,
        )}">${escapar(p.boton.texto)}</a>
      </div>
    </div>
  </div>`;

  const cuerpo = `<section class="portada" aria-labelledby="portada-marca">
  ${flor('portada__fondo')}
  <div class="contenedor portada__interior">
    <div class="portada__marca">
      <h1 class="lockup lockup--portada" id="portada-marca">
        <span class="lockup__nombre">${escapar(marca.nombre)}</span>
        <span class="lockup__sub">${escapar(marca.submarca)}</span>
      </h1>
      ${flor('lockup__flor')}
    </div>
    <p class="portada__lema">${enriquecer(portada.lema)}</p>
    <div class="botones botones--centrados">
      <a class="boton boton--claro" href="${prefijo}cursos.html">Ver los cursos</a>
      <a class="boton boton--contorno" href="${prefijo}tienda.html">Visitar la tienda</a>
    </div>
  </div>
  <a class="portada__bajar" href="#especialidades" aria-hidden="true" tabindex="-1"><span></span></a>
</section>

<section class="seccion seccion--marfil" id="especialidades" aria-labelledby="especialidades-titulo">
  <div class="contenedor">
    ${encabezado({ ...portada.matriz, id: 'especialidades-titulo', centrado: true })}
    <div class="arbol">
      <div class="arbol__raiz" aria-hidden="true">${flor()}</div>
      <ol class="arbol__ramas${servicios.length % 2 ? ' arbol__ramas--impar' : ''}" style="--columnas:${columnasArbol}">
      ${tarjetasServicios(ctx, servicios, { columnas: columnasArbol })}
      </ol>
    </div>
  </div>
</section>
${
  cursos.length
    ? `
<section class="seccion seccion--papel" aria-labelledby="cursos-titulo">
  <div class="contenedor">
    <div class="encabezado-fila">
      ${encabezado({ ...portada.cursos, id: 'cursos-titulo' })}
      <a class="enlace-flecha" href="${prefijo}cursos.html">Todos los cursos ${FLECHA}</a>
    </div>
    ${listaProductos(ctx, cursos)}
  </div>
</section>
`
    : ''
}
<section class="publicos" aria-label="Cómo podemos ayudarte">
  ${portada.publicos.map(publico).join('\n  ')}
</section>

${principios(ctx, 'papel')}

<section class="seccion seccion--marfil" aria-labelledby="chef-titulo">
  <div class="contenedor dividido dividido--retrato">
    ${retrato(ctx)}
    <div class="semblanza" data-revelar>
      <p class="antetitulo">El chef</p>
      <h2 class="titulo" id="chef-titulo">${escapar(marca.nombre)}</h2>
      <p class="semblanza__texto">${enriquecer(chef.resumen)}</p>
      ${firma(ctx)}
      <a class="enlace-flecha" href="${prefijo}chef.html">Conoce al chef ${FLECHA}</a>
    </div>
  </div>
</section>

${cierre(ctx, portada.cierre)}`;

  return documento(ctx, {
    archivo: 'index.html',
    titulo: plano(portada.titulo),
    descripcion: `${nombreSitio(ctx)}: ${marca.descripcion.charAt(0).toLowerCase()}${marca.descripcion.slice(1)}`,
    cuerpo,
    activo: 'inicio',
    jsonLd: jsonLdInicio(ctx),
  });
}

export function paginaServicio(ctx, s) {
  const { marca, servicios, prefijo } = ctx;
  const whatsapp = botonWhatsApp(ctx, s.cierre.mensaje, 'boton--claro');
  const cuerpo = `<section class="heroe" aria-labelledby="titulo-pagina">
  <div class="contenedor heroe__rejilla">
    <div class="heroe__texto">
      <p class="antetitulo">${s.numero} · ${escapar(s.etiqueta)}</p>
      <h1 class="heroe__titulo" id="titulo-pagina">${escapar(s.nombre)}</h1>
      <p class="heroe__lema">${enriquecer(s.lema)}</p>
      <div class="botones">
        ${whatsapp}
        <a class="boton ${whatsapp ? 'boton--contorno' : 'boton--claro'}" href="${prefijo}contacto.html?servicio=${encodeURIComponent(
          s.slug,
        )}">${whatsapp ? 'Enviar un mensaje' : 'Solicitar información'}</a>
      </div>
    </div>
    ${lockup(ctx, { linea: s.nombre, clase: 'sello', atributos: ' aria-hidden="true"' })}
  </div>
</section>

<section class="seccion seccion--papel" id="detalles" aria-labelledby="intro-titulo">
  <div class="contenedor dividido dividido--intro">
    <div class="intro" data-revelar>
      <p class="antetitulo">${escapar(s.etiqueta)}</p>
      <h2 class="titulo" id="intro-titulo">${enriquecer(s.intro.titulo)}</h2>
      ${s.intro.parrafos.map((p) => `<p class="intro__parrafo">${enriquecer(p)}</p>`).join('\n      ')}
    </div>
    ${marco(ctx, s.intro)}
  </div>
</section>

${bloques(ctx, s.bloques)}

${otras(
  ctx,
  servicios.filter((otro) => otro.slug !== s.slug),
  { titulo: 'Otras especialidades del atelier' },
)}

${cierre(ctx, { ...s.cierre, servicio: s.slug })}`;

  return documento(ctx, {
    archivo: `${s.slug}.html`,
    titulo: `${plano(s.tituloSeo)} | ${marca.nombre} · ${marca.submarca}`,
    descripcion: s.descripcionSeo,
    cuerpo,
    activo: s.slug,
    mensaje: s.cierre.mensaje,
    jsonLd: jsonLdServicio(ctx, s),
  });
}

function jsonLdTienda(ctx) {
  const conPrecio = ctx.catalogo.filter((p) => p.precio != null && !p.ejemplo);
  if (!conPrecio.length) return null;
  const vendedor = { '@type': 'Organization', name: nombreSitio(ctx) };
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: plano(ctx.tienda.titulo),
    itemListElement: conPrecio.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': p.categoria === 'cursos' ? 'Course' : 'Product',
        name: p.nombre,
        description: plano(p.resumen),
        ...(p.categoria === 'cursos' ? { provider: vendedor } : { brand: vendedor }),
        offers: {
          '@type': 'Offer',
          price: p.precio,
          priceCurrency: ctx.tienda.moneda,
          availability: `https://schema.org/${p.agotado ? 'SoldOut' : 'InStock'}`,
          url: ctx.sitio.dominio ? `${ctx.sitio.dominio}/tienda.html` : undefined,
        },
      },
    })),
  };
}

export function paginaTienda(ctx) {
  const { tienda, catalogo, marca } = ctx;
  const categorias = tienda.categorias.filter((c) => catalogo.some((p) => p.categoria === c.id));
  const filtros =
    categorias.length > 1
      ? `<div class="filtros" role="group" aria-label="Filtrar productos">
      <button class="filtro" type="button" data-filtro="" aria-pressed="true">Todo</button>
      ${categorias
        .map(
          (c) =>
            `<button class="filtro" type="button" data-filtro="${escapar(c.id)}" aria-pressed="false">${escapar(c.nombre)}</button>`,
        )
        .join('\n      ')}
    </div>`
      : '';
  const condiciones = [
    tienda.pagos && `<strong>Formas de pago:</strong> ${escapar(tienda.pagos)}`,
    tienda.entregas && `<strong>Entregas:</strong> ${escapar(tienda.entregas)}`,
  ].filter(Boolean);

  const cuerpo = `<section class="heroe heroe--breve" aria-labelledby="titulo-pagina">
  <div class="contenedor">
    <p class="antetitulo">Tienda</p>
    <h1 class="heroe__titulo" id="titulo-pagina">${enriquecer(tienda.titulo)}</h1>
    <p class="heroe__lema">${enriquecer(tienda.lema)}</p>
  </div>
</section>

<section class="seccion seccion--papel" aria-label="Productos">
  <div class="contenedor">
    ${filtros}
    ${listaProductos(ctx, catalogo, {
      vacio: 'Muy pronto tendremos cursos y piezas disponibles. Escríbenos y te contamos las novedades.',
    })}
    ${condiciones.length ? `<p class="tienda__condiciones">${flor()}<span>${condiciones.join(' · ')}</span></p>` : ''}
  </div>
</section>

${BLOQUES.pasos(
  { antetitulo: 'Cómo comprar', titulo: 'Así funciona *tu pedido*', items: tienda.pasos },
  { id: 'como-comprar', clases: 'seccion seccion--arena' },
)}

${cierre(ctx, {
  titulo: '¿Buscas algo *especial*?',
  texto: 'Si no encuentras lo que buscas, escríbenos: hacemos piezas por encargo y clases a la medida.',
  mensaje: 'Hola, tengo una pregunta sobre la tienda del atelier.',
})}`;

  return documento(ctx, {
    archivo: 'tienda.html',
    titulo: `${plano(tienda.tituloSeo)} | ${marca.nombre} · ${marca.submarca}`,
    descripcion: tienda.descripcionSeo,
    cuerpo,
    activo: 'tienda',
    mensaje: 'Hola, tengo una pregunta sobre la tienda del atelier.',
    jsonLd: jsonLdTienda(ctx),
  });
}

export function paginaChef(ctx) {
  const { marca, chef, servicios, portada } = ctx;
  const trayectoria = chef.trayectoria?.length
    ? `<section class="seccion seccion--marfil" aria-labelledby="trayectoria-titulo">
  <div class="contenedor dividido dividido--fijo">
    ${encabezado({ antetitulo: 'Trayectoria', titulo: 'Un oficio *construido en la cocina*', id: 'trayectoria-titulo' })}
    <ol class="trayectoria">
      ${chef.trayectoria
        .map(
          (t) => `<li data-revelar><span class="trayectoria__periodo">${escapar(t.periodo)}</span><p>${enriquecer(t.texto)}</p></li>`,
        )
        .join('\n      ')}
    </ol>
  </div>
</section>`
    : '';

  const cuerpo = `<section class="heroe" aria-labelledby="titulo-pagina">
  <div class="contenedor heroe__rejilla">
    <div class="heroe__texto">
      <p class="antetitulo">El chef</p>
      <h1 class="heroe__titulo" id="titulo-pagina">${escapar(marca.nombre)}</h1>
      <p class="heroe__lema">${enriquecer(chef.lema)}</p>
    </div>
    ${lockup(ctx, { clase: 'sello', atributos: ' aria-hidden="true"' })}
  </div>
</section>

<section class="seccion seccion--papel" aria-labelledby="historia-titulo">
  <div class="contenedor dividido dividido--retrato">
    ${retrato(ctx)}
    <div class="semblanza" data-revelar>
      <p class="antetitulo">Historia</p>
      <h2 class="titulo" id="historia-titulo">Un oficio, <em>una casa</em></h2>
      ${chef.bio.map((p) => `<p class="semblanza__texto">${enriquecer(p)}</p>`).join('\n      ')}
      ${firma(ctx)}
    </div>
  </div>
</section>

${trayectoria}

${principios(ctx, trayectoria ? 'papel' : 'marfil')}

${otras(ctx, servicios, { titulo: 'Especialidades del atelier', fondo: trayectoria ? 'marfil' : 'papel' })}

${cierre(ctx, portada.cierre)}`;

  return documento(ctx, {
    archivo: 'chef.html',
    titulo: `${plano(chef.tituloSeo)} | ${marca.nombre} · ${marca.submarca}`,
    descripcion: chef.descripcionSeo,
    cuerpo,
    activo: 'chef',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: marca.nombre,
      jobTitle: 'Chef',
      description: plano(chef.resumen),
      worksFor: organizacion(ctx),
    },
  });
}

export function paginaContacto(ctx) {
  const { contactoPagina, servicios, contacto, marca, prefijo } = ctx;
  const whatsapp = String(contacto.whatsapp || '').replace(/\D/g, '');
  const botones = [
    whatsapp
      ? `<button class="boton boton--oscuro" type="submit" name="canal" value="whatsapp">${ICONOS.whatsapp}<span>Enviar por WhatsApp</span></button>`
      : '',
    contacto.correo
      ? `<button class="boton ${whatsapp ? 'boton--linea' : 'boton--oscuro'}" type="submit" name="canal" value="correo">${ICONOS.correo}<span>Enviar por correo</span></button>`
      : '',
  ].filter(Boolean);
  if (!botones.length) botones.push('<button class="boton boton--oscuro" type="submit">Enviar mensaje</button>');
  const opcional = '<span class="campo__opcional">(opcional)</span>';
  const datos = datosContacto(ctx);

  const cuerpo = `<section class="heroe heroe--breve" aria-labelledby="titulo-pagina">
  <div class="contenedor">
    <p class="antetitulo">Contacto</p>
    <h1 class="heroe__titulo" id="titulo-pagina">${escapar(contactoPagina.titulo)}</h1>
    <p class="heroe__lema">${enriquecer(contactoPagina.lema)}</p>
  </div>
</section>

<section class="seccion seccion--papel" aria-label="Formulario y datos de contacto">
  <div class="contenedor contacto">
    <form class="formulario" id="formulario" data-whatsapp="${escapar(whatsapp)}" data-correo="${escapar(contacto.correo)}">
      <div class="campo">
        <label for="f-nombre">Nombre</label>
        <input id="f-nombre" name="nombre" type="text" autocomplete="name" required>
      </div>
      <div class="campo">
        <label for="f-servicio">Me interesa</label>
        <select id="f-servicio" name="servicio" required>
          <option value="" selected disabled>Elige una opción</option>
          ${servicios.map((s) => `<option value="${escapar(s.slug)}">${escapar(s.nombre)}</option>`).join('\n          ')}
          <option value="otro">Otro tema</option>
        </select>
      </div>
      <div class="campo">
        <label for="f-telefono">Teléfono ${opcional}</label>
        <input id="f-telefono" name="telefono" type="tel" autocomplete="tel" inputmode="tel">
      </div>
      <div class="campo">
        <label for="f-correo">Correo ${opcional}</label>
        <input id="f-correo" name="correo" type="email" autocomplete="email">
      </div>
      <div class="campo">
        <label for="f-detalle">Negocio o evento ${opcional}</label>
        <input id="f-detalle" name="detalle" type="text" placeholder="Ej. hotel boutique o boda para 120">
      </div>
      <div class="campo">
        <label for="f-fecha">Fecha tentativa ${opcional}</label>
        <input id="f-fecha" name="fecha" type="date">
      </div>
      <div class="campo campo--completo">
        <label for="f-mensaje">Mensaje</label>
        <textarea id="f-mensaje" name="mensaje" rows="5" required placeholder="Cuéntanos qué necesitas"></textarea>
      </div>
      <div class="campo campo--completo campo--casilla">
        <input id="f-privacidad" name="privacidad" type="checkbox" required>
        <label for="f-privacidad">He leído y acepto el <a href="${prefijo}aviso-de-privacidad.html">aviso de privacidad</a>.</label>
      </div>
      <div class="campo--completo formulario__acciones">
        ${botones.join('\n        ')}
      </div>
      <p class="campo--completo formulario__estado" role="status" aria-live="polite"></p>
    </form>

    <aside class="contacto__datos" aria-labelledby="datos-titulo">
      ${lockup(ctx, { clase: 'contacto__lockup' })}
      <h2 class="visualmente-oculto" id="datos-titulo">Datos de contacto</h2>
      <ul class="contacto__lista">
        ${datos
          .map((dato) => `<li><span class="contacto__etiqueta">${escapar(dato.etiqueta)}</span>${datoContacto(dato)}</li>`)
          .join('\n        ')}
      </ul>
      <p class="contacto__nota">Escríbenos por el medio que prefieras; te responderemos a la brevedad.</p>
    </aside>
  </div>
</section>`;

  return documento(ctx, {
    archivo: 'contacto.html',
    titulo: `${plano(contactoPagina.tituloSeo)} | ${marca.nombre} · ${marca.submarca}`,
    descripcion: contactoPagina.descripcionSeo,
    cuerpo,
    activo: 'contacto',
  });
}

export function paginaPrivacidad(ctx) {
  const { legal, marca, contacto } = ctx;
  const correo = legal.correo || contacto.correo;
  const actualizado = fechaLarga(legal.actualizado);
  const cuerpo = `<section class="heroe heroe--breve" aria-labelledby="titulo-pagina">
  <div class="contenedor">
    <p class="antetitulo">Legal</p>
    <h1 class="heroe__titulo" id="titulo-pagina">Aviso de privacidad</h1>
    ${actualizado ? `<p class="heroe__lema">Última actualización: ${escapar(actualizado)}</p>` : ''}
  </div>
</section>

<section class="seccion seccion--papel">
  <div class="contenedor prosa">
    <p>${escapar(legal.responsable)}${
      legal.domicilio ? `, con domicilio en ${escapar(legal.domicilio)},` : ''
    } (en adelante, «${escapar(nombreSitio(ctx))}») es responsable del uso y la protección de los datos personales que nos proporcionas, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.</p>

    <h2>Datos que recabamos</h2>
    <p>Cuando nos escribes por el formulario de este sitio, por WhatsApp o por correo, podemos recabar tu nombre, teléfono, correo electrónico, el nombre de tu negocio o el tipo de evento, una fecha tentativa y la información que decidas compartir en tu mensaje. No solicitamos datos personales sensibles.</p>

    <h2>Para qué los usamos</h2>
    <ul>
      <li>Responder tu solicitud y darle seguimiento.</li>
      <li>Preparar propuestas y cotizaciones.</li>
      <li>Coordinar la prestación del servicio o la entrega de tu pedido.</li>
    </ul>
    <p>De manera secundaria, y solo si no te opones, podremos enviarte información sobre nuestros servicios. Puedes pedirnos en cualquier momento que dejemos de hacerlo.</p>

    <h2>Transferencias</h2>
    <p>No vendemos ni compartimos tus datos personales con terceros, salvo cuando sea necesario para cumplir una obligación legal o atender el requerimiento de una autoridad competente.</p>

    <h2>Tus derechos</h2>
    <p>Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su uso (derechos ARCO), así como revocar tu consentimiento, enviando tu solicitud ${
      correo ? `a <a href="mailto:${escapar(correo)}">${escapar(correo)}</a>` : 'por los medios de contacto de este sitio'
    }. Te responderemos dentro de los plazos que establece la ley.</p>

    <h2>Cookies y datos en tu navegador</h2>
    <p>Este sitio no utiliza cookies de rastreo ni herramientas de publicidad. La tienda guarda tu pedido en tu propio navegador (almacenamiento local) solo para que no se pierda mientras navegas; no se envía a ningún servidor hasta que tú decides mandarlo por WhatsApp o correo.</p>

    <h2>Cambios a este aviso</h2>
    <p>Cualquier modificación a este aviso de privacidad se publicará en esta misma página.</p>
  </div>
</section>`;

  return documento(ctx, {
    archivo: 'aviso-de-privacidad.html',
    titulo: `Aviso de privacidad | ${marca.nombre} · ${marca.submarca}`,
    descripcion: `Aviso de privacidad de ${nombreSitio(ctx)}.`,
    cuerpo,
  });
}

export function pagina404(ctx) {
  // Se sirve en cualquier ruta inexistente, asi que sus enlaces parten de la raiz del dominio.
  const raiz = { ...ctx, prefijo: '/' };
  const cuerpo = `<section class="heroe heroe--breve heroe--404" aria-labelledby="titulo-pagina">
  <div class="contenedor">
    <p class="antetitulo">Error 404</p>
    <h1 class="heroe__titulo" id="titulo-pagina">Esta página <em>no existe</em></h1>
    <p class="heroe__lema">Es posible que el enlace haya cambiado. Te invitamos a volver al inicio.</p>
    <div class="botones">
      <a class="boton boton--claro" href="/index.html">Ir al inicio</a>
      <a class="boton boton--contorno" href="/contacto.html">Contacto</a>
    </div>
  </div>
</section>`;
  return documento(raiz, {
    archivo: '404.html',
    titulo: `Página no encontrada | ${ctx.marca.nombre} · ${ctx.marca.submarca}`,
    descripcion: 'La página que buscas no existe.',
    cuerpo,
    indexable: false,
  });
}

export function robots(ctx) {
  if (!ctx.sitio.dominio) return 'User-agent: *\nDisallow: /\n';
  return `User-agent: *\nAllow: /\n\nSitemap: ${ctx.sitio.dominio}/sitemap.xml\n`;
}

export function sitemap(ctx, archivos) {
  const urls = archivos.map((archivo) => `${ctx.sitio.dominio}/${archivo === 'index.html' ? '' : archivo}`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${escapar(url)}</loc></url>`).join('\n')}
</urlset>
`;
}
