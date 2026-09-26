// Comportamiento del sitio: menu movil y submenu, cabecera, aparicion de bloques y formulario de contacto.
(() => {
  const raiz = document.documentElement;
  const cabecera = document.getElementById('cabecera');
  const boton = document.querySelector('.menu-boton');
  const menu = document.getElementById('menu');

  // Menu movil. Mientras esta abierto, el resto de la pagina queda inerte.
  const fondo = [document.querySelector('main'), document.querySelector('.pie'), document.querySelector('.flotante')];
  const alternarMenu = (abrir) => {
    if (!boton) return;
    boton.setAttribute('aria-expanded', String(abrir));
    boton.querySelector('.visualmente-oculto').textContent = abrir ? 'Cerrar menú' : 'Abrir menú';
    raiz.classList.toggle('menu-abierto', abrir);
    fondo.forEach((elemento) => {
      if (elemento) elemento.inert = abrir;
    });
  };
  if (boton && menu) {
    boton.addEventListener('click', () => {
      const abrir = boton.getAttribute('aria-expanded') !== 'true';
      alternarMenu(abrir);
      if (abrir) menu.querySelector('a')?.focus();
    });
    menu.addEventListener('click', (evento) => {
      if (evento.target.closest('a')) alternarMenu(false);
    });
    document.addEventListener('keydown', (evento) => {
      if (evento.key !== 'Escape' || !raiz.classList.contains('menu-abierto')) return;
      alternarMenu(false);
      boton.focus();
    });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', () => alternarMenu(false));
  }

  // Submenu de especialidades (en escritorio se despliega; en el menu movil siempre esta abierto).
  document.querySelectorAll('.menu__grupo').forEach((grupo) => {
    const desplegar = grupo.querySelector('.menu__desplegar');
    const alternar = (abrir) => {
      desplegar.setAttribute('aria-expanded', String(abrir));
      grupo.classList.toggle('menu__grupo--abierto', abrir);
    };
    desplegar.addEventListener('click', () => alternar(desplegar.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('click', (evento) => {
      if (!grupo.contains(evento.target)) alternar(false);
    });
    grupo.addEventListener('keydown', (evento) => {
      if (evento.key !== 'Escape' || desplegar.getAttribute('aria-expanded') !== 'true') return;
      evento.stopPropagation();
      alternar(false);
      desplegar.focus();
    });
    grupo.addEventListener('focusout', (evento) => {
      if (!grupo.contains(evento.relatedTarget)) alternar(false);
    });
  });

  // Cabecera: linea inferior al desplazarse. En la portada, la marca aparece cuando sale de vista el logotipo grande.
  if (cabecera) {
    const marcar = () => cabecera.classList.toggle('cabecera--desplazada', window.scrollY > 8);
    marcar();
    window.addEventListener('scroll', marcar, { passive: true });

    const logotipo = document.getElementById('portada-marca');
    if (logotipo && 'IntersectionObserver' in window) {
      new IntersectionObserver(
        ([entrada]) => cabecera.classList.toggle('cabecera--con-marca', !entrada.isIntersecting),
        { rootMargin: `-${cabecera.offsetHeight}px 0px 0px 0px` },
      ).observe(logotipo);
    } else {
      cabecera.classList.add('cabecera--con-marca');
    }
  }

  // Aparicion suave de los bloques al entrar en pantalla.
  const bloques = document.querySelectorAll('[data-revelar]');
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (bloques.length && 'IntersectionObserver' in window && !sinMovimiento) {
    raiz.classList.add('con-animaciones');
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: '0px 0px -6% 0px' },
    );
    bloques.forEach((bloque) => observador.observe(bloque));
  }

  // Formulario de contacto: arma el mensaje y lo abre en WhatsApp o en el correo del visitante.
  const formulario = document.getElementById('formulario');
  if (!formulario) return;

  const { whatsapp, correo } = formulario.dataset;
  const estado = formulario.querySelector('.formulario__estado');
  const servicio = formulario.elements.servicio;
  const elegido = new URLSearchParams(window.location.search).get('servicio');
  if (elegido && [...servicio.options].some((opcion) => opcion.value === elegido)) servicio.value = elegido;

  const avisar = (texto) => {
    if (estado) estado.textContent = texto;
  };
  const valor = (nombre) => (formulario.elements[nombre]?.value || '').trim();
  // pedido.js se carga antes que este archivo; si faltara, la fecha va tal cual.
  const fechaLarga = window.AtelierPedido?.fechaLarga ?? ((iso) => iso);

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (!formulario.reportValidity()) return;

    const interes = servicio.options[servicio.selectedIndex]?.text || '';
    const lineas = [
      `Hola, soy ${valor('nombre')}.`,
      `Me interesa: ${interes}.`,
      valor('detalle') ? `Negocio o evento: ${valor('detalle')}` : null,
      valor('fecha') ? `Fecha tentativa: ${fechaLarga(valor('fecha'))}` : null,
      valor('telefono') ? `Teléfono: ${valor('telefono')}` : null,
      valor('correo') ? `Correo: ${valor('correo')}` : null,
      '',
      valor('mensaje'),
    ].filter((linea) => linea !== null);
    const texto = lineas.join('\n');
    const canal = evento.submitter?.value || (whatsapp ? 'whatsapp' : 'correo');

    if (canal === 'whatsapp' && whatsapp) {
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      avisar('Abrimos WhatsApp con tu mensaje listo: solo falta enviarlo.');
    } else if (correo) {
      const asunto = `${interes} · ${valor('nombre')}`;
      window.location.href = `mailto:${correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(texto)}`;
      avisar('Abrimos tu correo con el mensaje listo: solo falta enviarlo.');
    } else {
      avisar('Este formulario todavía no tiene un canal de envío configurado.');
    }
  });
})();
