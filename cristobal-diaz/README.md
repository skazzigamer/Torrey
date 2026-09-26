# Cristóbal Díaz · Atelier de Cocina

Sitio web de la marca matriz y sus cuatro especialidades: **Asesorías
profesionales** para hoteles y restaurantes, **Mystery Guest**, **Alta
Pastelería** y **Pastelería de Lujo**. Es un sitio estático (HTML, CSS y un
poco de JavaScript), sin dependencias ni `npm install`.

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
| Inicio (la matriz) | `index.html` | Presenta el atelier y lleva a cada especialidad; separa hoteles/restaurantes de celebraciones. |
| Asesorías profesionales | `asesorias.html` | Hoteles y restaurantes: áreas de trabajo, método, formatos y preguntas. |
| Mystery Guest | `mystery-guest.html` | Hoteles y restaurantes: qué se evalúa, cómo funciona y qué se entrega. |
| Alta Pastelería | `alta-pasteleria.html` | Cartas de postres, banquetes, desarrollo de producto y formación. |
| Pastelería de Lujo | `pasteleria-de-lujo.html` | Bodas, celebraciones, eventos y regalos por encargo. |
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
  los buscadores no indexarlo y no genera `sitemap.xml` ni la imagen de
  vista previa al compartir el enlace. Al poner el dominio definitivo se activa
  todo eso.
- `SERVICIOS`: una entrada por especialidad (cada una genera su página). Las
  secciones se arman con bloques: `rejilla`, `lista`, `pasos`, `destacado`,
  `etiquetas`, `preguntas` y `nota`.
- `CHEF`: la biografía es **provisional**; `trayectoria` queda oculta mientras
  esté vacía.
- `LEGAL`: responsable y domicilio del aviso de privacidad.

Los textos son una propuesta a partir de lo que envió el cliente: hay que
validarlos con él, sobre todo las preguntas frecuentes y la diferencia entre
Alta Pastelería (técnica, formación y servicio a negocios) y Pastelería de Lujo
(piezas por encargo para particulares y eventos).

## Fotos

Mientras no haya fotos, cada espacio muestra una ilustración de línea (un
plato, un pastel o el monograma del chef). Para usar una foto se copia a
`recursos/img/` y se escribe el nombre del archivo en `contenido.js`. Si el
archivo no existe, la compilación avisa y deja la ilustración.

| Dónde | Campo | Foto sugerida |
| --- | --- | --- |
| Asesorías | `SERVICIOS[0].intro.imagen` | El chef con un equipo en cocina o revisando una carta. |
| Mystery Guest | `SERVICIOS[1].intro.imagen` | Mesa servida o detalle de servicio, sin rostros de clientes. |
| Alta Pastelería | `SERVICIOS[2].intro.imagen` | Postre emplatado o entremet. |
| Pastelería de Lujo | `SERVICIOS[3].intro.imagen` | Pastel de autor o caja de regalo. |
| El chef | `CHEF.imagen` | Retrato vertical del chef. |
| Firma | `CHEF.firma` | La firma del logotipo en negro, PNG o SVG con fondo transparente. |

Formato vertical 4:5 (por ejemplo 1200 × 1500 px), en JPG o WebP de menos
de 300 KB.

## Logotipo

El logotipo se recreó a partir de los archivos que envió el cliente: el nombre
en Poppins ExtraBold, "Atelier de Cocina" espaciado y la flor redibujada en
SVG (constante `FLOR` en `plantillas.js`). Con esa misma base se generaron
`recursos/img/og.jpg` (la imagen que aparece al compartir el enlace por
WhatsApp o redes), el favicon y el ícono para iPhone. Si el cliente entrega
los archivos originales en vector, conviene reemplazar esas tres imágenes.

## Publicar

`publico/` es el sitio listo para subir:

- **Netlify Drop**: arrastrar la carpeta `publico/` a app.netlify.com/drop.
- **Netlify, Vercel o Cloudflare Pages** conectados al repositorio: carpeta
  base `cristobal-diaz`, comando `npm run build`, carpeta de salida `publico`.
- **Hosting tradicional (cPanel, FTP)**: subir el contenido de `publico/` a
  `public_html/`. Para la página de error, agregar al `.htaccess`:
  `ErrorDocument 404 /404.html`.

Antes de publicar:

1. Completar WhatsApp y correo; `npm run build` enumera lo pendiente.
2. Poner `SITIO.dominio`.
3. Completar `LEGAL.domicilio` y revisar el aviso de privacidad con el cliente.
4. Validar los textos y cargar las fotos.

## Notas técnicas

- Las tipografías (Poppins y Cormorant Garamond, licencia SIL Open Font) se
  alojan en el propio sitio: no hay peticiones a Google ni cookies. Si más
  adelante se agrega analítica, hay que actualizar el aviso de privacidad.
- Sin JavaScript todo el contenido queda visible; el script solo agrega el menú
  móvil, las animaciones y el envío del formulario.
- Respeta la preferencia de "reducir movimiento" del sistema.
- `text-rendering: geometricPrecision` en `body` evita que Chrome en Linux
  abra huecos después de la "t" de Poppins.
