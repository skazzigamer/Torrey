// Todo el texto y los datos del sitio. Edita aqui y ejecuta `npm run build`.
//
// Los textos son una propuesta a partir de lo que envio el cliente
// (matriz + cuatro especialidades): hay que validarlos con el.
// En titulos y parrafos, *texto* se muestra en cursiva.
// Las imagenes van en recursos/img/ y aqui solo se escribe el nombre del archivo.

export const MARCA = {
  nombre: 'Cristóbal Díaz',
  submarca: 'Atelier de Cocina',
  descripcion:
    'Asesorías profesionales para hoteles y restaurantes, Mystery Guest, alta pastelería y pastelería de lujo.',
  // Se dedujo de la lada 33; confirmar con el cliente.
  ciudad: 'Guadalajara, Jalisco',
};

export const CONTACTO = {
  // WhatsApp: 52 + 10 digitos, sin espacios ni signos. Ej. '523312345678'.
  // Mientras este vacio no se muestran los botones de WhatsApp.
  whatsapp: '',
  // Como se muestra el telefono en la pagina. Ej. '33 1234 5678'.
  telefono: '',
  correo: '',
  instagram: '', // usuario, sin @
  facebook: '', // URL completa de la pagina
  horario: '', // Ej. 'Lunes a sábado, 9:00 a 19:00 h'
};

export const SITIO = {
  // Dominio definitivo, sin diagonal final. Ej. 'https://cristobaldiaz.mx'.
  // Vacio = vista previa: se pide a los buscadores no indexar y no se genera sitemap.
  dominio: '',
};

export const PORTADA = {
  titulo: 'Cristóbal Díaz · Atelier de Cocina | Asesorías, Mystery Guest y Alta Pastelería',
  lema: 'Asesoría para hoteles y restaurantes, Mystery Guest, alta pastelería y pastelería de lujo. *Un mismo oficio, un mismo estándar.*',
  matriz: {
    antetitulo: 'La casa matriz',
    titulo: 'Un atelier del que nacen *cuatro especialidades*',
    texto:
      'Atelier de Cocina es el taller de Cristóbal Díaz: el lugar donde se prueba, se corrige y se afina cada detalle hasta que está a la altura. De esa misma disciplina nacen cuatro especialidades, pensadas para quienes viven de la hospitalidad y para quienes quieren celebrar con lo mejor.',
  },
  publicos: [
    {
      antetitulo: 'Para hoteles y restaurantes',
      titulo: 'Que tu operación esté a la altura de *lo que prometes*.',
      texto:
        'Diagnóstico, estrategia y acompañamiento en cocina y servicio, y una mirada externa que te dice la verdad sobre la experiencia de tus clientes.',
      servicios: ['asesorias', 'mystery-guest'],
      boton: 'Agendar un diagnóstico',
      servicio: 'asesorias',
      tono: 'oscuro',
    },
    {
      antetitulo: 'Para tus celebraciones',
      titulo: 'Piezas únicas para *momentos irrepetibles*.',
      texto:
        'Pasteles de autor, mesas de postres y regalos hechos a mano con la técnica de la alta pastelería.',
      servicios: ['pasteleria-de-lujo', 'alta-pasteleria'],
      boton: 'Cotizar una pieza',
      servicio: 'pasteleria-de-lujo',
      tono: 'claro',
    },
  ],
  cierre: {
    titulo: '¿Tienes un proyecto *en mente*?',
    texto:
      'Cuéntanos qué necesitas —una asesoría, una evaluación o una pieza especial— y te respondemos personalmente.',
    mensaje: 'Hola, me gustaría recibir información sobre Atelier de Cocina.',
  },
};

export const PRINCIPIOS = {
  antetitulo: 'El estándar del atelier',
  titulo: 'Cuatro principios, *en todo lo que hacemos*',
  items: [
    {
      titulo: 'Técnica',
      texto: 'La base clásica de la cocina y la pastelería, aplicada con rigor en cada proceso.',
    },
    {
      titulo: 'Producto',
      texto: 'Ingredientes elegidos con criterio: sin buen producto no hay buen resultado.',
    },
    {
      titulo: 'Detalle',
      texto: 'Temperaturas, tiempos, texturas y trato: la excelencia está en lo que casi nadie ve.',
    },
    {
      titulo: 'Hospitalidad',
      texto: 'Todo lo que hacemos termina en una persona que merece sentirse bien atendida.',
    },
  ],
};

// Cada especialidad genera su propia pagina (<slug>.html).
// Tipos de bloque: rejilla, lista, pasos, destacado, etiquetas, preguntas, nota.
export const SERVICIOS = [
  {
    slug: 'asesorias',
    numero: '01',
    nombre: 'Asesorías profesionales',
    menu: 'Asesorías',
    etiqueta: 'Hoteles y restaurantes',
    tituloSeo: 'Asesorías para hoteles y restaurantes',
    descripcionSeo:
      'Asesoría gastronómica profesional para hoteles y restaurantes: concepto y apertura, ingeniería de menú, costeo, operación de cocina y capacitación de equipos.',
    lema: 'Acompañamiento experto para que tu cocina, tu servicio y tus números trabajen a favor de *una misma experiencia*.',
    resumen: 'Diagnóstico, estrategia e implementación en cocina, servicio y rentabilidad.',
    intro: {
      titulo: 'Cuando algo no funciona en un restaurante, *casi nunca es un solo detalle*.',
      parrafos: [
        'Por eso revisamos la operación completa: de la compra de insumos al último plato que sale del pase, del costo de cada receta a la forma en que tu equipo recibe a un cliente.',
        'Trabajamos contigo y con tu gente, dentro de tu cocina, hasta que los cambios funcionan solos.',
      ],
      imagen: '', // Ej. 'asesorias.jpg' (cocina en servicio, chef con equipo)
      imagenAlt: 'Cristóbal Díaz trabajando con un equipo de cocina',
      ilustracion: 'plato',
    },
    bloques: [
      {
        tipo: 'rejilla',
        antetitulo: 'Áreas de trabajo',
        titulo: 'En qué te *acompañamos*',
        items: [
          {
            titulo: 'Concepto y apertura',
            texto:
              'Definición del concepto gastronómico, desarrollo de carta, selección de proveedores y acompañamiento en la puesta en marcha.',
          },
          {
            titulo: 'Ingeniería de menú y costeo',
            texto: 'Rentabilidad por platillo, recetas estándar, fichas técnicas y control de costos y mermas.',
          },
          {
            titulo: 'Operación de cocina',
            texto:
              'Flujo de trabajo, distribución de estaciones, mise en place, tiempos de salida y estándares de producción.',
          },
          {
            titulo: 'Capacitación de equipos',
            texto: 'Formación práctica para cocina y servicio: técnica, estandarización y cultura de hospitalidad.',
          },
          {
            titulo: 'Alimentos y bebidas en hotel',
            texto:
              'Desayunos, room service, banquetes y eventos con la consistencia de un restaurante de primer nivel.',
          },
          {
            titulo: 'Calidad e inocuidad',
            texto: 'Buenas prácticas de higiene, manejo seguro de alimentos y control de calidad en cada etapa.',
          },
        ],
      },
      {
        tipo: 'lista',
        antetitulo: 'Para quién',
        titulo: 'Pensado para *quienes viven de la hospitalidad*',
        items: [
          'Hoteles boutique y hoteles de cadena',
          'Restaurantes en apertura',
          'Restaurantes en operación que buscan crecer o corregir el rumbo',
          'Grupos restauranteros',
          'Cocinas de banquetes y eventos',
          'Cafeterías y pastelerías',
        ],
      },
      {
        tipo: 'pasos',
        antetitulo: 'Método',
        titulo: 'Cómo *trabajamos*',
        items: [
          {
            titulo: 'Diagnóstico',
            texto: 'Visitamos tu operación, escuchamos a tu equipo y revisamos carta, procesos y números.',
          },
          {
            titulo: 'Plan de acción',
            texto: 'Priorizamos lo que más impacta y lo convertimos en entregables con fechas claras.',
          },
          {
            titulo: 'Implementación',
            texto: 'Trabajamos en tu cocina, junto a tu equipo, hasta que los nuevos estándares funcionan.',
          },
          {
            titulo: 'Seguimiento',
            texto: 'Medimos resultados y ajustamos para que las mejoras se sostengan en el tiempo.',
          },
        ],
      },
      {
        tipo: 'rejilla',
        variante: 'formatos',
        antetitulo: 'Formatos',
        titulo: 'Tres formas de *empezar*',
        items: [
          {
            titulo: 'Diagnóstico puntual',
            texto: 'Una revisión a fondo de tu operación, con un reporte de hallazgos y prioridades.',
          },
          {
            titulo: 'Proyecto',
            texto: 'Un objetivo definido —apertura, nueva carta, reingeniería de cocina— con inicio y cierre.',
          },
          {
            titulo: 'Acompañamiento',
            texto: 'Asesoría continua para equipos que buscan mejorar de forma constante, mes a mes.',
          },
        ],
      },
      {
        tipo: 'preguntas',
        antetitulo: 'Preguntas frecuentes',
        titulo: 'Antes de *empezar*',
        items: [
          {
            pregunta: '¿Cuánto cuesta una asesoría?',
            respuesta:
              'Cada proyecto se cotiza a la medida. Después de una primera conversación sobre tu negocio recibes una propuesta con alcance, tiempos y honorarios.',
          },
          {
            pregunta: '¿Cuánto tiempo toma?',
            respuesta:
              'Depende del alcance: un diagnóstico se resuelve en pocos días y un proyecto integral puede tomar varias semanas. Los tiempos quedan definidos desde la propuesta.',
          },
          {
            pregunta: '¿La información de mi negocio es confidencial?',
            respuesta:
              'Sí. Recetas, costos y procesos se manejan con estricta confidencialidad, y puede formalizarse con un acuerdo por escrito.',
          },
          {
            pregunta: '¿Atienden negocios fuera de la ciudad?',
            respuesta:
              'Cuéntanos dónde está tu negocio: las visitas y el seguimiento se organizan según la ubicación y el alcance del proyecto.',
          },
        ],
      },
    ],
    cierre: {
      titulo: 'Agenda *un diagnóstico*',
      texto:
        'Cuéntanos sobre tu hotel o restaurante y lo que te gustaría mejorar. Te proponemos el siguiente paso.',
      mensaje: 'Hola, me interesa una asesoría profesional para mi hotel o restaurante.',
    },
  },
  {
    slug: 'mystery-guest',
    numero: '02',
    nombre: 'Mystery Guest',
    menu: 'Mystery Guest',
    etiqueta: 'Evaluación anónima',
    tituloSeo: 'Mystery Guest para restaurantes y hoteles',
    descripcionSeo:
      'Evaluación anónima de la experiencia en restaurantes y hoteles, hecha por un profesional de la cocina: reporte por área y recomendaciones accionables.',
    lema: 'Vivimos tu experiencia como un cliente más y te contamos, con ojo de chef, *lo que nadie más te dice*.',
    resumen: 'Un experto vive tu experiencia como cliente y te entrega un reporte claro para mejorarla.',
    intro: {
      titulo: 'Tu equipo cambia cuando sabe *que lo observan*.',
      parrafos: [
        'Un Mystery Guest ve tu negocio como lo ve tu cliente real: sin aviso, sin preparación y sin trato especial.',
        'La diferencia está en quién observa. La evaluación la hace un profesional de la cocina y la hospitalidad, capaz de distinguir si un plato falla por técnica, por producto o por proceso, y de decirte cómo corregirlo.',
      ],
      imagen: '', // Ej. 'mystery-guest.jpg' (mesa servida, detalle de servicio)
      imagenAlt: 'Mesa servida durante una evaluación de Mystery Guest',
      ilustracion: 'plato',
    },
    bloques: [
      {
        tipo: 'rejilla',
        antetitulo: 'Qué evaluamos',
        titulo: 'Toda la experiencia, *de principio a fin*',
        items: [
          {
            titulo: 'Primer contacto',
            texto: 'Reservación, llamadas y mensajes: tiempo de respuesta, cortesía y claridad.',
          },
          {
            titulo: 'Llegada y recepción',
            texto: 'Bienvenida, tiempos de espera y asignación de mesa o habitación.',
          },
          {
            titulo: 'Servicio',
            texto: 'Atención, conocimiento de la carta, sugerencias, ritmo y trato.',
          },
          {
            titulo: 'Cocina',
            texto: 'Sabor, técnica, temperatura, presentación y consistencia de cada plato.',
          },
          {
            titulo: 'Bebidas',
            texto: 'Carta, maridaje, preparación y servicio de cada bebida.',
          },
          {
            titulo: 'Ambiente e imagen',
            texto: 'Limpieza, iluminación, música, uniformes y detalles del espacio.',
          },
          {
            titulo: 'Cuenta y despedida',
            texto: 'Precisión, tiempos, formas de pago y la última impresión.',
          },
          {
            titulo: 'Hospedaje',
            texto: 'En hoteles: check-in, habitación, amenidades, desayuno y check-out.',
          },
        ],
      },
      {
        tipo: 'destacado',
        texto: 'Lo que tu cliente no te dice, *se lo cuenta a alguien más*.',
      },
      {
        tipo: 'pasos',
        antetitulo: 'Cómo funciona',
        titulo: 'Cuatro pasos, *total discreción*',
        items: [
          {
            titulo: 'Brief confidencial',
            texto: 'Definimos contigo qué quieres evaluar y con qué estándar, sin que tu equipo lo sepa.',
          },
          {
            titulo: 'Visita anónima',
            texto: 'Vivimos la experiencia como un cliente real, sin previo aviso a tu personal.',
          },
          {
            titulo: 'Reporte detallado',
            texto: 'Recibes una evaluación por área, con hallazgos, evidencia y calificación.',
          },
          {
            titulo: 'Sesión de resultados',
            texto: 'Revisamos juntos el reporte y definimos un plan de mejora priorizado.',
          },
        ],
      },
      {
        tipo: 'lista',
        antetitulo: 'Entregables',
        titulo: 'Qué *recibes*',
        items: [
          'Reporte escrito por cada área de la experiencia',
          'Calificación contra el estándar que definimos contigo',
          'Hallazgos puntuales, con evidencia',
          'Recomendaciones priorizadas y accionables',
          'Sesión de retroalimentación con la dirección',
          'Visitas periódicas para medir la evolución (opcional)',
        ],
      },
      {
        tipo: 'preguntas',
        antetitulo: 'Preguntas frecuentes',
        titulo: 'Lo que suelen *preguntarnos*',
        items: [
          {
            pregunta: '¿Mi equipo sabrá que viene un Mystery Guest?',
            respuesta:
              'No. Solo la dirección conoce el servicio; la visita ocurre sin previo aviso para ver la operación tal como es.',
          },
          {
            pregunta: '¿Se puede evaluar más de una sucursal?',
            respuesta:
              'Sí. Se aplica el mismo estándar de evaluación en cada ubicación para que puedas compararlas entre sí.',
          },
          {
            pregunta: '¿Cada cuánto conviene hacerlo?',
            respuesta:
              'Una visita es una fotografía del momento; varias a lo largo del año muestran la tendencia y el efecto real de las mejoras.',
          },
        ],
      },
    ],
    cierre: {
      titulo: 'Solicita un *Mystery Guest*',
      texto:
        'Cuéntanos qué tipo de negocio tienes y qué te gustaría evaluar. La conversación es confidencial.',
      mensaje: 'Hola, me interesa el servicio de Mystery Guest para mi negocio.',
    },
  },
  {
    slug: 'alta-pasteleria',
    numero: '03',
    nombre: 'Alta Pastelería',
    menu: 'Alta Pastelería',
    etiqueta: 'Técnica y formación',
    tituloSeo: 'Alta pastelería para restaurantes, hoteles y profesionales',
    descripcionSeo:
      'Alta pastelería de autor: cartas de postres para restaurantes y hoteles, pastelería para banquetes, desarrollo de producto y formación de equipos.',
    lema: 'Precisión, técnica y sabor: la pastelería entendida como *un oficio de autor*.',
    resumen: 'Postres de autor, cartas de postres para restaurantes y hoteles, y formación de equipos.',
    intro: {
      titulo: 'La alta pastelería *no admite atajos*.',
      parrafos: [
        'Es exactitud: temperaturas, texturas y equilibrios que deben repetirse igual cada vez.',
        'En el atelier la ponemos al servicio de restaurantes, hoteles y profesionales que quieren que el postre esté a la altura del resto de la experiencia.',
      ],
      imagen: '', // Ej. 'alta-pasteleria.jpg' (postre emplatado, entremet)
      imagenAlt: 'Postre de alta pastelería emplatado',
      ilustracion: 'pastel',
    },
    bloques: [
      {
        tipo: 'rejilla',
        antetitulo: 'Líneas de trabajo',
        titulo: 'Pastelería para *quienes sirven a otros*',
        items: [
          {
            titulo: 'Carta de postres',
            texto: 'Postres de autor para restaurantes y hoteles: concepto, recetas, fichas técnicas y costeo.',
          },
          {
            titulo: 'Hotel y banquetes',
            texto: 'Mignardises, petit fours, desayunos y mesas de postres con estándar de alta pastelería.',
          },
          {
            titulo: 'Desarrollo de producto',
            texto: 'Nuevas piezas y líneas de pastelería para cafeterías, pastelerías y marcas.',
          },
          {
            titulo: 'Formación',
            texto: 'Cursos y clases magistrales para equipos de cocina y profesionales de la pastelería.',
          },
        ],
      },
      {
        tipo: 'etiquetas',
        antetitulo: 'Del taller',
        titulo: 'Técnica *clásica*, mirada contemporánea',
        items: [
          'Entremets',
          'Petit gâteaux',
          'Postres emplatados',
          'Tartas finas',
          'Viennoiserie',
          'Bombonería',
          'Mignardises',
          'Helados y sorbetes',
        ],
      },
      {
        tipo: 'pasos',
        antetitulo: 'Proceso',
        titulo: 'Del concepto *a tu carta*',
        items: [
          {
            titulo: 'Concepto',
            texto: 'Partimos de tu propuesta, tu cocina y el perfil de tus clientes.',
          },
          {
            titulo: 'Desarrollo',
            texto: 'Probamos en el atelier hasta lograr sabor, textura y presentación.',
          },
          {
            titulo: 'Estandarización',
            texto: 'Recetas y fichas técnicas para que el resultado sea siempre el mismo.',
          },
          {
            titulo: 'Capacitación',
            texto: 'Enseñamos a tu equipo a producir y montar cada pieza.',
          },
        ],
      },
      {
        tipo: 'preguntas',
        antetitulo: 'Preguntas frecuentes',
        titulo: 'Lo que suelen *preguntarnos*',
        items: [
          {
            pregunta: '¿Mi propio equipo podrá preparar los postres?',
            respuesta:
              'Ese es el objetivo: entregamos recetas estandarizadas y capacitamos a tu personal hasta que el resultado sea consistente.',
          },
          {
            pregunta: '¿Trabajan con cafeterías y pastelerías?',
            respuesta:
              'Sí. Además de restaurantes y hoteles, desarrollamos producto para negocios que quieren elevar su vitrina.',
          },
        ],
      },
    ],
    cierre: {
      titulo: 'Hablemos de *tu pastelería*',
      texto: 'Cuéntanos qué quieres crear o mejorar: una carta de postres, una línea nueva o la formación de tu equipo.',
      mensaje: 'Hola, me interesa el servicio de Alta Pastelería.',
    },
  },
  {
    slug: 'pasteleria-de-lujo',
    numero: '04',
    nombre: 'Pastelería de Lujo',
    menu: 'Pastelería de Lujo',
    etiqueta: 'Piezas por encargo',
    tituloSeo: 'Pastelería de lujo por encargo',
    descripcionSeo:
      'Pasteles de autor y piezas de pastelería de lujo por encargo para bodas, celebraciones, eventos corporativos y regalos. Hechos a mano, en cantidades limitadas.',
    lema: 'Piezas únicas, hechas a mano, para los momentos que *merecen recordarse*.',
    resumen: 'Pasteles y creaciones exclusivas para bodas, celebraciones, eventos y regalos.',
    intro: {
      titulo: 'Cada pieza empieza con *una conversación*.',
      parrafos: [
        'La ocasión, los invitados, los sabores que te gustan, la historia que quieres contar. A partir de ahí diseñamos una creación irrepetible, con ingredientes de primera y el rigor de la alta pastelería.',
        'Elaboramos por encargo y en cantidades limitadas: así cada pieza recibe la atención que merece.',
      ],
      imagen: '', // Ej. 'pasteleria-de-lujo.jpg' (pastel de boda, caja de regalo)
      imagenAlt: 'Pastel de autor elaborado por encargo',
      ilustracion: 'pastel',
    },
    bloques: [
      {
        tipo: 'rejilla',
        antetitulo: 'Ocasiones',
        titulo: 'Para celebrar *lo que importa*',
        items: [
          {
            titulo: 'Bodas',
            texto: 'Pasteles de boda y mesas de postres diseñados para tu celebración.',
          },
          {
            titulo: 'Celebraciones',
            texto: 'Cumpleaños, aniversarios, XV años, bautizos y reuniones especiales.',
          },
          {
            titulo: 'Eventos corporativos',
            texto: 'Postres y piezas de marca para lanzamientos, juntas y celebraciones de empresa.',
          },
          {
            titulo: 'Regalos',
            texto: 'Cajas y detalles personalizados para clientes, socios o alguien especial.',
          },
          {
            titulo: 'Mesas de postres',
            texto: 'Una selección de piezas pequeñas, coordinadas en estilo y sabor.',
          },
          {
            titulo: 'Pastel de autor',
            texto: 'Una creación exclusiva, diseñada desde cero para ti.',
          },
        ],
      },
      {
        tipo: 'pasos',
        antetitulo: 'Cómo pedir',
        titulo: 'De tu idea *a la mesa*',
        items: [
          {
            titulo: 'Cuéntanos tu idea',
            texto: 'Fecha, número de invitados, estilo y sabores que te gustan.',
          },
          {
            titulo: 'Propuesta',
            texto: 'Te enviamos el diseño, los sabores y la cotización de tu pieza.',
          },
          {
            titulo: 'Confirmación',
            texto: 'Con tu confirmación apartamos la fecha y comenzamos a trabajar.',
          },
          {
            titulo: 'Entrega',
            texto: 'Elaboramos tu pieza y coordinamos la entrega o la recolección.',
          },
        ],
      },
      {
        tipo: 'nota',
        texto:
          'Las piezas se elaboran por encargo y en cantidades limitadas. Escríbenos con anticipación: las fechas se confirman por orden de solicitud.',
      },
      {
        tipo: 'preguntas',
        antetitulo: 'Preguntas frecuentes',
        titulo: 'Antes de *pedir*',
        items: [
          {
            pregunta: '¿Con cuánta anticipación debo pedir?',
            respuesta:
              'Mientras antes, mejor. Para bodas y eventos grandes conviene escribirnos con varias semanas de anticipación; para piezas más sencillas, pregúntanos por la disponibilidad de tu fecha.',
          },
          {
            pregunta: '¿Puedo pedir un diseño personalizado?',
            respuesta:
              'Sí. Cada pieza se diseña a partir de tu idea: colores, estilo, sabores y tamaño.',
          },
          {
            pregunta: '¿Hacen entregas?',
            respuesta: 'Coordinamos la entrega o la recolección de cada pieza según el evento y la ubicación.',
          },
        ],
      },
    ],
    cierre: {
      titulo: 'Cotiza *tu pieza*',
      texto: 'Cuéntanos la fecha, el número de invitados y la idea que tienes en mente.',
      mensaje: 'Hola, me gustaría cotizar una pieza de Pastelería de Lujo.',
    },
  },
];

export const CHEF = {
  tituloSeo: 'Cristóbal Díaz, chef',
  descripcionSeo:
    'Cristóbal Díaz, chef y fundador de Atelier de Cocina: asesorías para hoteles y restaurantes, Mystery Guest, alta pastelería y pastelería de lujo.',
  lema: 'Chef y fundador de *Atelier de Cocina*.',
  // PROVISIONAL: reemplazar con la biografia real del cliente.
  bio: [
    'Cristóbal Díaz fundó Atelier de Cocina para reunir en una sola casa todo lo que la cocina profesional le ha enseñado: la disciplina de la técnica, el respeto por el producto y la certeza de que la hospitalidad se construye en cada detalle.',
    'Hoy acompaña a hoteles y restaurantes que buscan elevar su operación, evalúa experiencias como Mystery Guest y crea piezas de alta pastelería y pastelería de lujo para quienes quieren celebrar con lo mejor.',
  ],
  resumen:
    'Chef y fundador de Atelier de Cocina. Su trabajo une la disciplina de la cocina profesional con una convicción sencilla: la hospitalidad se construye en cada detalle, del primer contacto al último bocado.',
  imagen: '', // Ej. 'chef.jpg' (retrato vertical, 4:5)
  imagenAlt: 'Retrato del chef Cristóbal Díaz',
  firma: '', // Ej. 'firma.svg' o 'firma.png' (firma en negro, fondo transparente)
  // Trayectoria (opcional). Si queda vacia, la seccion no se muestra.
  // Ej. { periodo: '2015 — 2019', texto: 'Chef ejecutivo en ...' }
  trayectoria: [],
};

export const CONTACTO_PAGINA = {
  tituloSeo: 'Contacto',
  descripcionSeo:
    'Escríbenos para asesorías, Mystery Guest, alta pastelería o pastelería de lujo. Te respondemos personalmente.',
  titulo: 'Hablemos',
  lema: 'Cuéntanos qué necesitas. *Te respondemos personalmente.*',
};

// Aviso de privacidad. Validarlo con el cliente o su asesor legal antes de publicar.
export const LEGAL = {
  responsable: 'Cristóbal Díaz',
  domicilio: '', // Domicilio para oir y recibir notificaciones
  correo: '', // Si queda vacio se usa CONTACTO.correo
  actualizado: '2026-09-26',
};
