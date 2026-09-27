# Cristóbal Díaz · Atelier de Cocina

Sitio web y tienda de la marca matriz: un **taller de cocina** donde se imparten
**cursos**, y del que salen las demás especialidades: **Asesorías
profesionales** para hoteles y restaurantes, **Mystery Guest**, **Alta
Pastelería**, **Pastelería de Lujo** y **Cheesecake, galletas & más**. Es un
sitio estático (HTML, CSS y un poco de JavaScript), sin dependencias ni
`npm install`.

```
cd cristobal-diaz
npm run build   # genera el sitio en publico/ y lista lo que falta
npm start       # vista previa en http://localhost:4174
npm test
```

Requiere Node 20.11 o posterior.

## Páginas

| Página | Archivo | Para quién |
| --- | --- | --- |
| Inicio (la matriz) | `index.html` | Presenta el taller y sus especialidades, los próximos cursos y dos caminos: negocios y particulares. |
| Cursos y talleres | `cursos.html` | Calendario de cursos, para quién son, inscripción, clases privadas y para empresas. |
| Asesorías profesionales | `asesorias.html` | Hoteles y restaurantes: áreas de trabajo, método, formatos y preguntas. |
| Mystery Guest | `mystery-guest.html` | Hoteles y restaurantes: qué se evalúa, cómo funciona y qué se entrega. |
| Alta Pastelería | `alta-pasteleria.html` | Cartas de postres, banquetes, desarrollo de producto y capacitación de equipos. |
| Pastelería de Lujo | `pasteleria-de-lujo.html` | Piezas de la casa y pedidos por encargo para bodas, eventos y regalos. |
| Cheesecake, galletas & más | `cheesecake-y-galletas.html` | Sub-marca con logotipo propio: recetas de la casa para pedir en línea. |
| Tienda | `tienda.html` | Cursos, pastelería y regalos, con filtros y pedido. |
| El chef | `chef.html` | Semblanza, trayectoria (opcional) y principios. |
| Contacto | `contacto.html` | Formulario que arma el mensaje y lo abre en WhatsApp o en el correo. |
| Aviso de privacidad | `aviso-de-privacidad.html` | Requerido en México al recabar datos personales. |

## Qué editar

Todo el texto y los datos están en **`contenido.js`**; después de cambiarlo
se ejecuta `npm run build`. En títulos y párrafos, `*texto*` sale en cursiva.

- `CONTACTO`: WhatsApp (`52` + 10 dígitos, p. ej. `523312345678`), teléfono,
  correo, Instagram, Facebook y horario. Lo que quede vacío no se muestra;
  sin WhatsApp no aparecen los botones de WhatsApp ni el botón flotante.
- `SITIO.dominio`: mientras esté vacío el sitio es una **vista previa**: pide a
  los buscadores no indexarlo, no genera `sitemap.xml` ni la imagen de vista
  previa al compartir el enlace, y muestra los productos de ejemplo. Al poner
  el dominio definitivo se activa todo eso y los ejemplos desaparecen.
- `SERVICIOS`: una entrada por especialidad; el orden define su número. Las
  secciones se arman con bloques: `rejilla`, `lista`, `pasos`, `destacado`,
  `etiquetas`, `preguntas`, `nota` y `catalogo` (los productos de una
  categoría de la tienda).
- `TIENDA` y `CATALOGO`: ver abajo.
- `CHEF`: la biografía es **provisional**; `trayectoria` queda oculta mientras
  esté vacía.
- `LEGAL`: responsable y domicilio del aviso de privacidad.

Los textos son una propuesta a partir de lo que envió el cliente: hay que
validarlos con él.

## Tienda y pagos

Cada producto tiene un botón **Apartar lugar** (cursos) o **Agregar al
pedido**. El pedido se guarda en el navegador del cliente mientras navega y se
envía por **WhatsApp** (o correo) con todo el detalle: productos, cantidades,
fechas, total y, si hay pastelería, si se recoge o se envía y para qué fecha.
El atelier confirma disponibilidad y cobra por el medio que prefiera.

Los productos van en `CATALOGO`:

```js
{
  id: 'chocolate-bomboneria',       // único, minúsculas y guiones
  categoria: 'cursos',              // cursos | cheesecake | pasteleria | regalos
  nombre: 'Chocolate y bombonería',
  resumen: 'Templado, rellenos y acabados brillantes.',
  detalles: ['Nivel intermedio', '1 sesión'],
  fecha: 'Sábado 14 de noviembre, 10:00 h',
  precio: 1800,                     // null = "Precio por anunciar" / "a cotizar"
  unidad: 'por persona',
  cupo: 8,                          // limita cuántos lugares se pueden apartar
  pago: 'https://mpago.la/…',       // opcional: botón "Pagar en línea"
  imagen: 'curso-chocolate.jpg',    // opcional, en recursos/img/
}
```

- `desde: true` muestra "Desde $…"; `agotado: true` cambia el botón por
  **Lista de espera**.
- Un curso con varias fechas se registra una vez por fecha.
- **Los 11 productos actuales son ejemplos** (`ejemplo: true`): solo se ven en
  la vista previa y nunca se publican con dominio. Hay que reemplazarlos por
  los cursos, piezas y precios reales del cliente.
- **Cobro en línea sin programar nada**: en Mercado Pago ("Link de pago") o en
  Stripe ("Payment Links") se crea un enlace por producto con su precio y se
  pega en `pago`. El cliente paga en la página segura de Mercado Pago o Stripe
  (con tarjeta y, según la cuenta, en OXXO o por transferencia).
- `TIENDA.pagos` y `TIENDA.entregas` describen formas de pago y zona de entrega;
  se muestran en la tienda y en el pedido.
- Si más adelante se necesita cobrar el carrito completo en línea o controlar
  inventario, el siguiente paso es una plataforma de tienda (Shopify,
  Tiendanube) o un pequeño servidor con Mercado Pago Checkout Pro.

## Fotos

Mientras no haya fotos, cada espacio muestra una ilustración de línea (un
batidor, un plato, un pastel, una rebanada de cheesecake, una caja de regalo o
el monograma del chef). Para
usar una foto se copia a `recursos/img/` y se escribe el nombre del archivo en
`contenido.js`. Si el archivo no existe, la compilación avisa y deja la
ilustración.

| Dónde | Campo | Foto sugerida |
| --- | --- | --- |
| Cursos | `SERVICIOS[0].intro.imagen` | El chef enseñando a un grupo en el taller. |
| Asesorías | `SERVICIOS[1].intro.imagen` | El chef con un equipo en cocina o revisando una carta. |
| Mystery Guest | `SERVICIOS[2].intro.imagen` | Mesa servida o detalle de servicio, sin rostros de clientes. |
| Alta Pastelería | `SERVICIOS[3].intro.imagen` | Postre emplatado o entremet. |
| Pastelería de Lujo | `SERVICIOS[4].intro.imagen` | Pastel de autor o caja de regalo. |
| Cheesecake, galletas & más | `SERVICIOS[5].intro.imagen` | Rebanada de cheesecake o caja de galletas. |
| Productos | `CATALOGO[].imagen` | Una foto por curso o pieza, horizontal 4:3. |
| El chef | `CHEF.imagen` | Retrato vertical del chef. |
| Firma | `CHEF.firma` | La firma del logotipo en negro, PNG o SVG con fondo transparente. |

Formato vertical 4:5 para las especialidades y el chef (por ejemplo 1200 × 1500
px) y horizontal 4:3 para los productos, en JPG o WebP de menos de 300 KB.

## Logotipo

Los archivos que envió el cliente están en `marca/` (no se publican): el
logotipo matriz y el de la sub-marca "Cheesecake, galletas & más". En el sitio
el logotipo se dibuja con texto y SVG para que se vea nítido en cualquier
tamaño, con las medidas tomadas de esos archivos:

- Nombre en Poppins SemiBold (600) con espaciado de -0.075em y el espacio
  entre palabras a -0.043em; "Atelier de Cocina" en Poppins Regular (400) y la
  línea de cada especialidad en Medium (500), las dos muy espaciadas. Los pesos
  salen del grosor de los trazos medido en los dos archivos. En la cabecera,
  donde el nombre mide 20 px, "Atelier de Cocina" también va en Medium para
  que se lea.
- "Atelier de Cocina" a 0.268 del tamaño del nombre y la flor de seis pétalos
  redibujada sobre la original (constante `FLOR` en `plantillas.js`).
- Cada especialidad usa el patrón de sub-marca del cliente: nombre, "Atelier
  de Cocina" y la línea de la especialidad entre rayas.

Con esa misma base se generaron `recursos/img/og.jpg` (la imagen que aparece al
compartir el enlace por WhatsApp o redes), el favicon y el ícono para iPhone.

Nota para el cliente: en su logotipo dice "GALLETAS & MAS"; lo correcto es
"MÁS", con acento. En el sitio ya aparece corregido.

## Publicar

`publico/` es el sitio listo para subir:

- **Netlify Drop**: arrastrar la carpeta `publico/` a app.netlify.com/drop.
- **Netlify conectado al repositorio**: en la configuración del sitio, la rama
  donde está el sitio y **Base directory** `cristobal-diaz`. El comando, la
  carpeta de salida y la versión de Node los toma de `netlify.toml`. Sin la
  carpeta base, Netlify compila el proyecto de la raíz del repositorio, que es
  otro.
- **Vercel o Cloudflare Pages** conectados al repositorio: carpeta base
  `cristobal-diaz`, comando `npm run build`, carpeta de salida `publico` y
  Node 20.11 o posterior.
- **Hosting tradicional (cPanel, FTP)**: subir el contenido de `publico/` a
  `public_html/`. Para la página de error, agregar al `.htaccess`:
  `ErrorDocument 404 /404.html`.

Antes de publicar:

1. Completar WhatsApp y correo; `npm run build` enumera lo pendiente.
2. Cargar los cursos y productos reales con sus precios, y las formas de pago.
3. Poner `SITIO.dominio`.
4. Completar `LEGAL.domicilio` y revisar el aviso de privacidad con el cliente.
5. Validar los textos y cargar las fotos.

## Notas técnicas

- Las tipografías (Poppins y Cormorant Garamond, licencia SIL Open Font) se
  alojan en el propio sitio: no hay peticiones a Google ni cookies. El pedido
  se guarda en el almacenamiento local del navegador y el aviso de privacidad
  lo explica. Si más adelante se agrega analítica, hay que actualizar el aviso.
- Sin JavaScript todo el contenido queda visible y los botones de compra abren
  WhatsApp (o el formulario) con el producto; el script agrega el pedido, el
  menú móvil, los filtros, las animaciones y el envío de formularios.
- Respeta la preferencia de "reducir movimiento" del sistema.
- `text-rendering: geometricPrecision` en `body` evita que Chrome en Linux
  abra huecos después de la "t" de Poppins.
