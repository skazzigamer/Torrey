// Todo el texto y los datos del sitio. Edita aqui y ejecuta `npm run build`.
//
// Los textos son una propuesta a partir de lo que envio el cliente (la matriz,
// sus especialidades y el taller donde dara cursos): hay que validarlos con el.
// En titulos y parrafos, *texto* se muestra en cursiva.
// Las imagenes van en recursos/img/ y aqui solo se escribe el nombre del archivo.

export const MARCA = {
  nombre: 'Cristóbal Díaz',
  submarca: 'Atelier de Cocina',
  descripcion:
    'Cursos de cocina y pastelería, asesorías para hoteles y restaurantes, Mystery Guest, alta pastelería, pastelería de lujo y cheesecake, galletas & más.',
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
  titulo: 'Cristóbal Díaz · Atelier de Cocina | Cursos de cocina, asesorías y alta pastelería',
  lema: 'Cursos de cocina, asesoría para hoteles y restaurantes, Mystery Guest y pastelería de autor, *del cheesecake de la casa a la alta pastelería*.',
  matriz: {
    antetitulo: 'La casa matriz',
    titulo: 'Un taller de cocina del que nace *todo lo demás*',
    texto:
      'Atelier de Cocina es el taller de Cristóbal Díaz: un espacio para cocinar, enseñar y afinar cada detalle hasta que está a la altura. Ahí se imparten los cursos y de ahí salen las demás especialidades, pensadas para quienes viven de la hospitalidad y para quienes quieren aprender, regalar y celebrar con lo mejor.',
  },
  // Muestra hasta tres cursos del catalogo en la portada.
  cursos: {
    antetitulo: 'En el taller',
    titulo: 'Próximos *cursos*',
    texto: 'Clases de cocina y pastelería para aficionados y profesionales. Aparta tu lugar desde la tienda.',
  },
  publicos: [
    {
      antetitulo: 'Para hoteles y restaurantes',
      titulo: 'Que tu operación esté a la altura de *lo que prometes*.',
      texto:
        'Diagnóstico, estrategia y acompañamiento en cocina y servicio, y una mirada externa que te dice la verdad sobre la experiencia de tus clientes.',
      servicios: ['asesorias', 'mystery-guest', 'alta-pasteleria'],
      boton: { texto: 'Agendar un diagnóstico', archivo: 'contacto.html?servicio=asesorias' },
      tono: 'oscuro',
    },
    {
      antetitulo: 'Para ti',
      titulo: 'Aprende, regala *y celebra*.',
      texto:
        'Cursos en el atelier, cheesecakes y galletas de la casa, y pasteles de autor hechos a mano con la técnica de la alta pastelería.',
      servicios: ['cursos', 'cheesecake-y-galletas', 'pasteleria-de-lujo'],
      boton: { texto: 'Visitar la tienda', archivo: 'tienda.html' },
      tono: 'claro',
    },
  ],
  cierre: {
    titulo: '¿Tienes un proyecto *en mente*?',
    texto:
      'Cuéntanos qué necesitas —un curso, una asesoría, una evaluación o una pieza especial— y te respondemos personalmente.',
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

// Cada especialidad genera su propia pagina (<slug>.html); el orden define su numero.
// Tipos de bloque: rejilla, lista, pasos, destacado, etiquetas, preguntas, nota y
// catalogo (muestra los productos de CATALOGO de una categoria).
export const SERVICIOS = [
  {
    slug: 'cursos',
    nombre: 'Cursos y talleres',
    etiqueta: 'Taller de cocina',
    tituloSeo: 'Cursos de cocina y pastelería',
    descripcionSeo:
      'Cursos y talleres de cocina y pastelería con el chef Cristóbal Díaz: clases para aficionados y profesionales, clases privadas y experiencias para empresas.',
    lema: 'Aprende en la cocina de un chef: técnica profesional explicada paso a paso, *para llevarla a tu propia mesa*.',
    resumen: 'Clases de cocina y pastelería en el atelier, para aficionados y profesionales.',
    intro: {
      titulo: 'El atelier también *es escuela*.',
      parrafos: [
        'Atelier de Cocina es, antes que nada, un taller: un espacio de trabajo donde se cocina, se prueba y se enseña.',
        'Los cursos llevan la disciplina de la cocina profesional a quienes quieren aprender en serio, sin importar su nivel: explicamos el porqué de cada técnica para que el resultado también salga en casa.',
      ],
      imagen: '', // Ej. 'cursos.jpg' (el chef enseñando a un grupo en el taller)
      imagenAlt: 'Clase de cocina en el taller de Cristóbal Díaz',
      ilustracion: 'batidor',
    },
    bloques: [
      {
        tipo: 'catalogo',
        categoria: 'cursos',
        antetitulo: 'Calendario',
        titulo: 'Próximos *cursos*',
        vacio: 'Muy pronto anunciaremos nuevas fechas. Escríbenos para apartar tu lugar.',
      },
      {
        tipo: 'lista',
        antetitulo: 'Para quién',
        titulo: 'Para quienes quieren *aprender en serio*',
        items: [
          'Aficionados que quieren dominar la técnica',
          'Profesionales que buscan perfeccionarse',
          'Equipos de cocina de hoteles y restaurantes',
          'Empresas que buscan una experiencia de integración',
          'Grupos y celebraciones privadas',
          'Quien quiere regalar una experiencia',
        ],
      },
      {
        tipo: 'pasos',
        antetitulo: 'Inscripción',
        titulo: 'Cómo *inscribirte*',
        items: [
          {
            titulo: 'Elige tu curso',
            texto: 'Revisa el nivel, la duración y la fecha de cada curso.',
          },
          {
            titulo: 'Aparta tu lugar',
            texto: 'Agrégalo a tu pedido y envíalo por WhatsApp, o paga en línea cuando esté disponible.',
          },
          {
            titulo: 'Confirmación',
            texto: 'Te confirmamos tu lugar y te enviamos las indicaciones del curso.',
          },
          {
            titulo: 'A cocinar',
            texto: 'Te esperamos en el atelier con todo listo para empezar.',
          },
        ],
      },
      {
        tipo: 'rejilla',
        antetitulo: 'A la medida',
        titulo: 'Clases privadas *y para empresas*',
        items: [
          {
            titulo: 'Clases privadas',
            texto: 'Una clase para ti y tus invitados, con el menú o la técnica que elijas.',
          },
          {
            titulo: 'Equipos de trabajo',
            texto: 'Experiencias de cocina para integrar equipos y celebrar logros.',
          },
          {
            titulo: 'Capacitación profesional',
            texto: 'Programas de cocina y pastelería para brigadas de hoteles y restaurantes.',
          },
        ],
      },
      {
        tipo: 'preguntas',
        antetitulo: 'Preguntas frecuentes',
        titulo: 'Antes de *inscribirte*',
        items: [
          {
            pregunta: '¿Necesito experiencia previa?',
            respuesta:
              'Cada curso indica su nivel. Los de nivel principiante no requieren experiencia: empezamos desde lo básico.',
          },
          {
            pregunta: '¿Qué debo llevar?',
            respuesta: 'Al confirmar tu lugar te enviamos las indicaciones de cada curso.',
          },
          {
            pregunta: '¿Puedo regalar un curso?',
            respuesta: 'Sí, con una tarjeta de regalo. Pregúntanos por los montos disponibles.',
          },
          {
            pregunta: '¿Qué pasa si no puedo asistir?',
            respuesta:
              'Avísanos lo antes posible: te diremos las opciones según el curso y la anticipación con que nos escribas.',
          },
        ],
      },
    ],
    cierre: {
      titulo: 'Aparta *tu lugar*',
      texto: 'Escríbenos para conocer las próximas fechas o para organizar una clase privada.',
      mensaje: 'Hola, me interesan los cursos del atelier.',
    },
  },
  {
    slug: 'asesorias',
    nombre: 'Asesorías profesionales',
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
    nombre: 'Mystery Guest',
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
    nombre: 'Alta Pastelería',
    etiqueta: 'Para restaurantes y hoteles',
    tituloSeo: 'Alta pastelería para restaurantes, hoteles y profesionales',
    descripcionSeo:
      'Alta pastelería de autor: cartas de postres para restaurantes y hoteles, pastelería para banquetes, desarrollo de producto y capacitación de equipos.',
    lema: 'Precisión, técnica y sabor: la pastelería entendida como *un oficio de autor*.',
    resumen: 'Cartas de postres, pastelería para banquetes y desarrollo de producto para negocios.',
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
            titulo: 'Capacitación de equipos',
            texto: 'Programas de pastelería para brigadas de hoteles y restaurantes, en su cocina o en el atelier.',
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
    nombre: 'Pastelería de Lujo',
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
        tipo: 'catalogo',
        categoria: 'pasteleria',
        antetitulo: 'Piezas de la casa',
        titulo: 'Para pedir *desde la tienda*',
        vacio: 'Pronto publicaremos nuestras piezas de la casa. Mientras tanto, cuéntanos qué necesitas.',
      },
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
  {
    // Sub-marca con logotipo propio del cliente: "— CHEESECAKE, GALLETAS & MAS —".
    slug: 'cheesecake-y-galletas',
    nombre: 'Cheesecake, galletas & más',
    etiqueta: 'Hechos en el atelier',
    tituloSeo: 'Cheesecake, galletas y más',
    descripcionSeo:
      'Cheesecakes, galletas y más, hechos a mano en el atelier de Cristóbal Díaz con técnica de alta pastelería. Haz tu pedido en línea.',
    lema: 'Recetas de la casa, hechas a mano con técnica de alta pastelería: *para compartir, regalar o darte un gusto.*',
    resumen: 'Cheesecakes, galletas y más, hechos a mano en el atelier para pedir en línea.',
    intro: {
      titulo: 'Lo clásico, *hecho como se debe*.',
      parrafos: [
        'Un buen cheesecake y una buena galleta no necesitan adornos: necesitan buen producto, la temperatura exacta y paciencia.',
        'Los preparamos en el atelier con el mismo cuidado que cualquier pieza de alta pastelería, para que cada pedido salga igual de bien que el primero.',
      ],
      imagen: '', // Ej. 'cheesecake.jpg' (rebanada de cheesecake, caja de galletas)
      imagenAlt: 'Cheesecake y galletas de Atelier de Cocina',
      ilustracion: 'cheesecake',
    },
    bloques: [
      {
        tipo: 'catalogo',
        categoria: 'cheesecake',
        antetitulo: 'De la vitrina',
        titulo: 'Recetas *de la casa*',
        vacio: 'Muy pronto publicaremos el menú. Mientras tanto, escríbenos para hacer tu pedido.',
      },
      {
        tipo: 'rejilla',
        antetitulo: 'Para cada ocasión',
        titulo: 'Para compartir, *regalar o consentirte*',
        items: [
          {
            titulo: 'Para compartir',
            texto: 'En la sobremesa, en la oficina o en una reunión con amigos.',
          },
          {
            titulo: 'Para regalar',
            texto: 'Cajas listas para dar un detalle que se recuerda.',
          },
          {
            titulo: 'Para eventos',
            texto: 'Pedidos grandes y mesas de postres, con anticipación.',
          },
        ],
      },
      {
        tipo: 'preguntas',
        antetitulo: 'Preguntas frecuentes',
        titulo: 'Antes de *pedir*',
        items: [
          {
            pregunta: '¿Con cuánta anticipación debo pedir?',
            respuesta: 'Depende del producto y de la cantidad: al recibir tu pedido te confirmamos la fecha de entrega.',
          },
          {
            pregunta: '¿Puedo recoger mi pedido?',
            respuesta: 'Sí, en el atelier. Si necesitas envío, pregúntanos por la cobertura y el costo.',
          },
          {
            pregunta: '¿Cómo se conservan?',
            respuesta:
              'El cheesecake, en refrigeración; las galletas, en un recipiente bien cerrado a temperatura ambiente. Con cada pedido te damos las indicaciones.',
          },
        ],
      },
    ],
    cierre: {
      titulo: 'Haz *tu pedido*',
      texto: 'Elige tus piezas en la tienda o escríbenos para un pedido especial.',
      mensaje: 'Hola, quiero hacer un pedido de cheesecake y galletas.',
    },
  },
];

// Tienda: los productos se agregan a un pedido que el cliente envía por WhatsApp
// (o correo). Para cobrar en línea, crea un "link de pago" en Mercado Pago o Stripe
// y pégalo en el campo `pago` del producto.
export const TIENDA = {
  tituloSeo: 'Tienda: cursos, pastelería y regalos',
  descripcionSeo:
    'Cursos de cocina y pastelería, piezas de la casa y tarjetas de regalo de Atelier de Cocina. Arma tu pedido y envíalo por WhatsApp.',
  titulo: 'La tienda *del atelier*',
  lema: 'Cursos, piezas de pastelería y regalos. Arma tu pedido y envíalo: *te confirmamos disponibilidad y forma de pago.*',
  moneda: 'MXN',
  pagos: '', // Formas de pago. Ej. 'Transferencia, tarjeta o efectivo.'
  entregas: '', // Ej. 'Entregas en Guadalajara y Zapopan, o recoge en el atelier.'
  categorias: [
    {
      id: 'cursos',
      nombre: 'Cursos',
      singular: 'Curso',
      servicio: 'cursos',
      sinPrecio: 'Precio por anunciar',
      ilustracion: 'batidor',
    },
    {
      id: 'cheesecake',
      nombre: 'Cheesecake y galletas',
      singular: 'Cheesecake y galletas',
      servicio: 'cheesecake-y-galletas',
      sinPrecio: 'Precio por confirmar',
      ilustracion: 'cheesecake',
      entrega: true,
    },
    {
      id: 'pasteleria',
      nombre: 'Pastelería',
      singular: 'Pastelería',
      servicio: 'pasteleria-de-lujo',
      sinPrecio: 'Precio a cotizar',
      ilustracion: 'pastel',
      entrega: true, // el pedido pregunta si se recoge o se envía
    },
    {
      id: 'regalos',
      nombre: 'Regalos',
      singular: 'Regalo',
      servicio: '',
      sinPrecio: 'Tú eliges el monto',
      ilustracion: 'caja',
    },
  ],
  pasos: [
    { titulo: 'Elige', texto: 'Agrega a tu pedido los cursos y las piezas que quieras.' },
    { titulo: 'Envía tu pedido', texto: 'Mándalo por WhatsApp con un clic: ya va con todo el detalle.' },
    { titulo: 'Confirmamos', texto: 'Te respondemos con la disponibilidad, el total y la forma de pago.' },
    { titulo: 'Disfruta', texto: 'Recoge o recibe tu pedido, o te esperamos en el taller.' },
  ],
};

// Productos de la tienda. Campos:
//   id: único, sin espacios · categoria: cursos | cheesecake | pasteleria | regalos · nombre · resumen
//   detalles: lista corta (nivel, duración, porciones...) · fecha: texto libre, para cursos
//   precio: número en pesos, o null para mostrar el texto `sinPrecio` de su categoría
//   desde: true muestra "Desde $…" · unidad: 'por persona', 'caja de 12'...
//   cupo: lugares del curso (limita la cantidad) · agotado: true ofrece lista de espera
//   pago: link de pago de Mercado Pago o Stripe (muestra "Pagar en línea")
//   imagen: archivo en recursos/img/
//   ejemplo: true = propuesta para la vista previa; nunca se publica con dominio.
// Todos los productos de abajo son ejemplos: reemplazarlos con los del cliente.
export const CATALOGO = [
  {
    id: 'fundamentos-pasteleria',
    categoria: 'cursos',
    nombre: 'Fundamentos de pastelería francesa',
    resumen: 'Masas, cremas y montajes clásicos: la base de toda la alta pastelería.',
    detalles: ['Nivel principiante', '3 sesiones'],
    fecha: '',
    precio: null,
    unidad: 'por persona',
    ejemplo: true,
  },
  {
    id: 'chocolate-bomboneria',
    categoria: 'cursos',
    nombre: 'Chocolate y bombonería',
    resumen: 'Templado, rellenos y acabados brillantes para bombones de autor.',
    detalles: ['Nivel intermedio', '1 sesión'],
    fecha: '',
    precio: null,
    unidad: 'por persona',
    ejemplo: true,
  },
  {
    id: 'pan-viennoiserie',
    categoria: 'cursos',
    nombre: 'Pan y viennoiserie',
    resumen: 'Croissants, brioche y masas laminadas, paso a paso.',
    detalles: ['Nivel intermedio', '2 sesiones'],
    fecha: '',
    precio: null,
    unidad: 'por persona',
    ejemplo: true,
  },
  {
    id: 'postres-emplatados',
    categoria: 'cursos',
    nombre: 'Postres emplatados',
    resumen: 'Composición, texturas y montaje de postres de restaurante.',
    detalles: ['Nivel profesional', '1 sesión'],
    fecha: '',
    precio: null,
    unidad: 'por persona',
    ejemplo: true,
  },
  {
    id: 'cheesecake-clasico',
    categoria: 'cheesecake',
    nombre: 'Cheesecake clásico',
    resumen: 'Cremoso, con base de galleta y horneado lento.',
    detalles: ['Entero', '10 a 12 porciones'],
    precio: null,
    ejemplo: true,
  },
  {
    id: 'cheesecake-frutos-rojos',
    categoria: 'cheesecake',
    nombre: 'Cheesecake de frutos rojos',
    resumen: 'El clásico de la casa con compota de frutos rojos.',
    detalles: ['Entero', '10 a 12 porciones'],
    precio: null,
    ejemplo: true,
  },
  {
    id: 'caja-galletas',
    categoria: 'cheesecake',
    nombre: 'Caja de galletas surtidas',
    resumen: 'Una selección de galletas de la casa, recién horneadas.',
    detalles: ['12 piezas'],
    precio: null,
    ejemplo: true,
  },
  {
    id: 'brownies',
    categoria: 'cheesecake',
    nombre: 'Brownies de chocolate',
    resumen: 'Chocolate intenso, centro húmedo y corteza crujiente.',
    detalles: ['Caja de 6'],
    precio: null,
    ejemplo: true,
  },
  {
    id: 'pastel-de-autor',
    categoria: 'pasteleria',
    nombre: 'Pastel de autor',
    resumen: 'Diseñado a partir de tu idea, con los sabores que elijas.',
    detalles: ['Por encargo', 'De 10 a 50 personas'],
    precio: null,
    ejemplo: true,
  },
  {
    id: 'caja-bombones',
    categoria: 'pasteleria',
    nombre: 'Caja de bombones',
    resumen: 'Bombones de autor con rellenos de temporada.',
    detalles: ['12 piezas'],
    precio: null,
    ejemplo: true,
  },
  {
    id: 'tarjeta-regalo',
    categoria: 'regalos',
    nombre: 'Tarjeta de regalo',
    resumen: 'Regala un curso o una pieza de la casa.',
    detalles: ['Válida para cursos y pastelería'],
    precio: null,
    ejemplo: true,
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
