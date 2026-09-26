# Catálogo Torrey

Herramienta para **extraer imágenes, títulos y descripciones** de las páginas de
catálogo de `gramoxgramo.com` (o cualquier tienda WordPress/WooCommerce) y
generar con ellas un **sitio estático propio**: rejilla de productos con
buscador, filtros por categoría y una ficha por producto.

```
npm install
npm run scrape     # extrae los productos -> data/productos.json + docs/imagenes/
npm run build      # genera el sitio      -> docs/
npm start          # vista previa en http://localhost:4173
```

O todo de una vez: `npm run todo`.

## Qué se extrae

Por cada producto se obtiene: título, descripción corta, descripción larga (en
texto y en HTML saneado), precio (texto y número), SKU, marca, tabla de
características, URL original y todas las imágenes de la galería, descargadas a
`docs/imagenes/` para que la página no dependa del sitio de origen.

## Cómo lo extrae

El scraper prueba tres estrategias en orden y combina lo que cada una aporta,
así que sigue funcionando aunque el sitio cambie de tema o de plantilla:

1. **API Store de WooCommerce** (`/wp-json/wc/store/v1/products`). Es la vía más
   limpia: entrega los datos ya estructurados. Si el sitio no la expone
   públicamente, pasa a la siguiente.
2. **JSON-LD** incrustado en la página (`schema.org/Product`, que publican
   WooCommerce, Yoast y RankMath).
3. **HTML de la rejilla**: tarjetas de WooCommerce (`li.product`,
   `.wc-block-grid__product`) y, si no hay marcado de tienda, una heurística que
   agrupa enlace + imagen + título (sirve para rejillas de Elementor).

Después abre la ficha de cada producto para completar la descripción larga, la
galería y la tabla de características. Sigue la paginación (`rel="next"`,
`a.next`) hasta agotar la categoría.

Detalles que evitan basura en los datos: de cada `srcset` toma la variante más
grande, convierte las miniaturas `-300x300.jpg` a su imagen original, resuelve
las rutas relativas a absolutas, descarta textos como "Añadir al carrito" y
sanea el HTML de la descripción (fuera `<script>`, `style=`, `onclick=`) antes
de publicarlo.

## Configuración

Todo se ajusta en `src/config.js`:

- `CATEGORIAS`: las páginas a extraer. Ya vienen `catalogo-torrey` y
  `amasadoras`; agrega más objetos `{ slug, nombre, url }` para otras secciones.
- `MARCA`: nombre, descripción, teléfono, correo y WhatsApp que aparecen en la
  página. Si pones `whatsapp` (formato `521XXXXXXXXXX`), cada ficha muestra un
  botón "Cotizar por WhatsApp" con el nombre del producto ya escrito.
- `RED`: ritmo entre peticiones, reintentos y tiempo límite. La espera por
  omisión es de 800 ms para no saturar el servidor de origen.

## Opciones del scrape

```
node src/scrape.js --limite=10        # solo los primeros 10 (prueba rápida)
node src/scrape.js --categoria=amasadoras
node src/scrape.js --sin-imagenes     # no descarga archivos
node src/scrape.js --sin-detalle      # no abre la ficha de cada producto
```

## Ver el diseño sin conexión

```
node src/ejemplo.js                      # datos de muestra desde test/fixtures
node src/build.js data/productos.ejemplo.json
npm start
```

## Publicar

`docs/` es un sitio estático sin dependencias: sirve tal cual en GitHub Pages
(Settings → Pages → rama y carpeta `/docs`), Netlify, Vercel o cualquier
hosting. Incluye `docs/productos.json` por si quieres consumir el catálogo desde
otra página o aplicación.

## Pruebas

```
npm test
```

Las pruebas corren contra los HTML de `test/fixtures/`, sin red: verifican las
tres estrategias de extracción, la lectura de la ficha, el saneado del HTML, la
fusión de fuentes y el manejo de precios y miniaturas.

## Nota sobre el contenido

Las imágenes y descripciones del sitio de origen son de su titular. Úsalas solo
si tienes derecho a hacerlo (por ejemplo, si es tu propio catálogo o eres
distribuidor autorizado).

## Otros proyectos en este repositorio

- [`cristobal-diaz/`](cristobal-diaz/): sitio web y tienda de Cristóbal Díaz ·
  Atelier de Cocina (cursos, especialidades y pedidos por WhatsApp). Es
  independiente del catálogo; su README explica cómo editarlo y publicarlo.
