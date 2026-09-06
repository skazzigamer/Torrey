// Configuracion de las fuentes a extraer.
// Agrega o quita categorias aqui; el scraper recorre todas.

export const SITIO = 'https://gramoxgramo.com';

export const CATEGORIAS = [
  {
    slug: 'catalogo-torrey',
    nombre: 'Catálogo Torrey',
    url: `${SITIO}/catalogo-torrey/`,
  },
  {
    slug: 'amasadoras',
    nombre: 'Amasadoras',
    url: `${SITIO}/amasadoras/`,
  },
];

// Datos de la marca para la pagina generada.
export const MARCA = {
  nombre: 'Catálogo Torrey',
  descripcion: 'Equipo para carnicería, panadería y abarrotes.',
  telefono: '',
  whatsapp: '',
  correo: '',
};

// Ajustes de red: ritmo cortes para no saturar el servidor de origen.
export const RED = {
  esperaEntrePeticionesMs: 800,
  reintentos: 4,
  tiempoLimiteMs: 30000,
  userAgent:
    'Mozilla/5.0 (compatible; CatalogoBot/1.0; +extraccion de catalogo propio)',
};
