// Pedido de la tienda: un carrito que vive en el navegador y se envia por WhatsApp o correo.
// Las funciones de calculo quedan en window.AtelierPedido (y se prueban en Node con vm).
(function (global) {
  'use strict';

  const formatoPrecio = (valor, moneda = 'MXN') => {
    const entero = Number.isInteger(valor);
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: entero ? 0 : 2,
      maximumFractionDigits: entero ? 0 : 2,
    }).format(valor);
  };

  // AAAA-MM-DD a "12 de octubre de 2026", sin desfase por zona horaria.
  const fechaLarga = (iso) => {
    const [anio, mes, dia] = String(iso).split('-').map(Number);
    if (!anio || !mes || !dia) return iso;
    return new Date(anio, mes - 1, dia).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const resumen = (lineas) =>
    lineas.reduce(
      (cuenta, linea) => {
        cuenta.piezas += linea.cantidad;
        if (typeof linea.precio === 'number') cuenta.total += linea.precio * linea.cantidad;
        else cuenta.porCotizar += 1;
        return cuenta;
      },
      { piezas: 0, total: 0, porCotizar: 0 },
    );

  const mensajePedido = ({ lineas, datos = {}, moneda = 'MXN' }) => {
    const { total, porCotizar } = resumen(lineas);
    const renglones = ['Hola, quiero hacer un pedido:', ''];
    for (const linea of lineas) {
      const precio = typeof linea.precio === 'number' ? formatoPrecio(linea.precio * linea.cantidad, moneda) : 'por cotizar';
      renglones.push(`• ${linea.cantidad} × ${linea.nombre}${linea.fecha ? ` (${linea.fecha})` : ''}: ${precio}`);
    }
    renglones.push('');
    if (total > 0) renglones.push(`${porCotizar ? 'Subtotal' : 'Total'}: ${formatoPrecio(total, moneda)} ${moneda}`);
    if (porCotizar) {
      renglones.push(porCotizar === lineas.length ? 'Quiero conocer precio y disponibilidad.' : 'Hay productos por cotizar.');
    }
    const extras = [
      datos.nombre && `Nombre: ${datos.nombre}`,
      datos.telefono && `Teléfono: ${datos.telefono}`,
      datos.entrega && `Entrega: ${datos.entrega}`,
      datos.fecha && `Fecha deseada: ${datos.fecha}`,
      datos.notas && `Notas: ${datos.notas}`,
    ].filter(Boolean);
    if (extras.length) renglones.push('', ...extras);
    return renglones.join('\n');
  };

  global.AtelierPedido = { formatoPrecio, fechaLarga, resumen, mensajePedido };
  if (typeof document === 'undefined') return;

  const fuente = document.getElementById('catalogo');
  const dialogo = document.getElementById('pedido');
  if (!fuente || !dialogo) return;

  const { moneda, productos } = JSON.parse(fuente.textContent);
  const CLAVE = 'atelier-pedido';
  const formulario = dialogo.querySelector('form');
  const lista = dialogo.querySelector('.pedido__lineas');
  const estado = formulario.querySelector('.formulario__estado');
  const aviso = document.querySelector('.aviso-pedido');

  const leer = () => {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) || '[]');
      return Array.isArray(guardado) ? guardado : [];
    } catch {
      return [];
    }
  };
  // Se descartan productos que ya no existen en el catalogo.
  let pedido = leer().filter((linea) => productos[linea.id] && linea.cantidad > 0);

  const guardar = () => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(pedido));
    } catch {
      // Sin almacenamiento (modo privado): el pedido dura mientras la pagina este abierta.
    }
  };

  const lineas = () => pedido.map((linea) => ({ ...productos[linea.id], id: linea.id, cantidad: linea.cantidad }));

  const PLANTILLA_LINEA = `<div class="pedido__info"><p class="pedido__nombre"></p><p class="pedido__detalle"></p></div>
    <div class="pedido__cantidad">
      <button type="button" data-accion="menos">−</button><span></span><button type="button" data-accion="mas">+</button>
    </div>
    <p class="pedido__importe"></p>
    <button class="pedido__quitar" type="button" data-accion="quitar">Quitar</button>`;

  const dibujarLinea = (linea) => {
    const elemento = document.createElement('li');
    elemento.className = 'pedido__linea';
    elemento.dataset.id = linea.id;
    elemento.innerHTML = PLANTILLA_LINEA;
    elemento.querySelector('.pedido__nombre').textContent = linea.nombre;
    elemento.querySelector('.pedido__detalle').textContent = [linea.fecha, linea.unidad].filter(Boolean).join(' · ');
    elemento.querySelector('.pedido__cantidad span').textContent = String(linea.cantidad);
    elemento.querySelector('.pedido__importe').textContent =
      typeof linea.precio === 'number' ? formatoPrecio(linea.precio * linea.cantidad, moneda) : 'Por cotizar';
    const [menos, mas] = elemento.querySelectorAll('.pedido__cantidad button');
    menos.setAttribute('aria-label', `Quitar uno: ${linea.nombre}`);
    mas.setAttribute('aria-label', `Agregar uno: ${linea.nombre}`);
    mas.disabled = linea.cantidad >= linea.maximo;
    elemento.querySelector('.pedido__quitar').setAttribute('aria-label', `Quitar del pedido: ${linea.nombre}`);
    return elemento;
  };

  const dibujar = () => {
    const actuales = lineas();
    const { piezas, total, porCotizar } = resumen(actuales);
    document.querySelectorAll('[data-cuenta]').forEach((cuenta) => {
      cuenta.textContent = String(piezas);
      cuenta.hidden = piezas === 0;
    });
    document.querySelectorAll('.carrito').forEach((boton) => {
      boton.setAttribute('aria-label', piezas ? `Tu pedido: ${piezas} ${piezas === 1 ? 'producto' : 'productos'}` : 'Tu pedido');
    });
    dialogo.classList.toggle('pedido--vacio', piezas === 0);
    lista.replaceChildren(...actuales.map(dibujarLinea));
    dialogo.querySelector('[data-total]').textContent = total > 0 ? `${formatoPrecio(total, moneda)} ${moneda}` : '—';
    dialogo.querySelector('[data-aclaracion]').textContent = porCotizar
      ? total > 0
        ? 'Más los productos por cotizar.'
        : 'Te confirmamos precio y disponibilidad.'
      : '';
    const conEntrega = actuales.some((linea) => linea.entrega);
    formulario.querySelectorAll('[data-solo-entrega]').forEach((campo) => {
      campo.hidden = !conEntrega;
    });
  };

  const cambiar = (id, diferencia) => {
    const producto = productos[id];
    if (!producto) return;
    const actual = pedido.find((linea) => linea.id === id);
    const cantidad = Math.min(Math.max((actual ? actual.cantidad : 0) + diferencia, 0), producto.maximo);
    if (actual) actual.cantidad = cantidad;
    else if (cantidad > 0) pedido.push({ id, cantidad });
    pedido = pedido.filter((linea) => linea.cantidad > 0);
    guardar();
    dibujar();
  };

  let temporizador;
  const avisar = (texto) => {
    if (!aviso) return;
    aviso.querySelector('[data-aviso-texto]').textContent = texto;
    aviso.hidden = false;
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      aviso.hidden = true;
    }, 5000);
  };

  const abrir = () => {
    if (aviso) aviso.hidden = true;
    estado.textContent = '';
    if (!dialogo.open) dialogo.showModal();
  };

  document.addEventListener('click', (evento) => {
    const agregar = evento.target.closest('[data-agregar]');
    if (agregar && productos[agregar.dataset.agregar]) {
      evento.preventDefault();
      cambiar(agregar.dataset.agregar, 1);
      avisar(`Agregado a tu pedido: ${productos[agregar.dataset.agregar].nombre}`);
      return;
    }
    if (evento.target.closest('[data-abrir-pedido]')) abrir();
  });

  dialogo.addEventListener('click', (evento) => {
    // El dialogo no tiene relleno propio: un clic sobre el mismo es un clic en el fondo.
    if (evento.target === dialogo || evento.target.closest('[data-cerrar-pedido]')) {
      dialogo.close();
      return;
    }
    if (evento.target.closest('[data-vaciar-pedido]')) {
      pedido = [];
      guardar();
      dibujar();
      estado.textContent = '';
      return;
    }
    const accion = evento.target.closest('[data-accion]');
    if (!accion) return;
    const { id } = accion.closest('[data-id]').dataset;
    if (accion.dataset.accion === 'mas') cambiar(id, 1);
    else if (accion.dataset.accion === 'menos') cambiar(id, -1);
    else cambiar(id, -Infinity);
  });

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const actuales = lineas();
    if (!actuales.length) {
      estado.textContent = 'Agrega al menos un producto a tu pedido.';
      return;
    }
    if (!formulario.reportValidity()) return;
    const valor = (nombre) => (formulario.elements[nombre]?.value || '').trim();
    const conEntrega = actuales.some((linea) => linea.entrega);
    const texto = mensajePedido({
      lineas: actuales,
      moneda,
      datos: {
        nombre: valor('nombre'),
        telefono: valor('telefono'),
        entrega: conEntrega ? valor('entrega') : '',
        fecha: conEntrega && valor('fecha') ? fechaLarga(valor('fecha')) : '',
        notas: valor('notas'),
      },
    });
    const { whatsapp, correo } = formulario.dataset;
    const canal = evento.submitter?.value || (whatsapp ? 'whatsapp' : 'correo');
    if (canal === 'whatsapp' && whatsapp) {
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      estado.textContent = 'Abrimos WhatsApp con tu pedido: solo falta enviarlo.';
    } else if (correo) {
      const asunto = `Pedido · ${valor('nombre')}`;
      window.location.href = `mailto:${correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(texto)}`;
      estado.textContent = 'Abrimos tu correo con el pedido listo: solo falta enviarlo.';
    } else {
      estado.textContent = 'La tienda todavía no tiene un canal de envío configurado.';
    }
  });

  // Otra pestaña cambio el pedido.
  window.addEventListener('storage', (evento) => {
    if (evento.key !== CLAVE) return;
    pedido = leer().filter((linea) => productos[linea.id] && linea.cantidad > 0);
    dibujar();
  });

  // Filtros de la tienda; ?categoria=cursos llega ya filtrado.
  const filtros = document.querySelector('.filtros');
  if (filtros) {
    const filtrar = (categoria) => {
      filtros.querySelectorAll('[data-filtro]').forEach((boton) => {
        boton.setAttribute('aria-pressed', String(boton.dataset.filtro === categoria));
      });
      document.querySelectorAll('.producto[data-categoria]').forEach((producto) => {
        producto.hidden = Boolean(categoria) && producto.dataset.categoria !== categoria;
      });
    };
    filtros.addEventListener('click', (evento) => {
      const boton = evento.target.closest('[data-filtro]');
      if (boton) filtrar(boton.dataset.filtro);
    });
    const inicial = new URLSearchParams(window.location.search).get('categoria');
    if (inicial && filtros.querySelector(`[data-filtro="${CSS.escape(inicial)}"]`)) filtrar(inicial);
  }

  dibujar();
})(typeof window !== 'undefined' ? window : globalThis);
