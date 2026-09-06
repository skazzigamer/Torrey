// Busqueda y filtro por categoria, del lado del cliente.
(function () {
  var buscar = document.getElementById('buscar');
  var rejilla = document.getElementById('rejilla');
  var conteo = document.getElementById('conteo');
  var vacio = document.getElementById('vacio');
  if (!rejilla) return;

  var tarjetas = Array.prototype.slice.call(rejilla.querySelectorAll('.tarjeta'));
  var categoria = '';

  function normalizar(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function aplicar() {
    var termino = normalizar(buscar ? buscar.value.trim() : '');
    var visibles = 0;
    tarjetas.forEach(function (tarjeta) {
      var coincideCategoria = !categoria || tarjeta.dataset.categoria === categoria;
      var coincideTexto = !termino || normalizar(tarjeta.dataset.busqueda || '').indexOf(termino) !== -1;
      var mostrar = coincideCategoria && coincideTexto;
      tarjeta.hidden = !mostrar;
      if (mostrar) visibles++;
    });
    if (conteo) conteo.textContent = String(visibles);
    if (vacio) vacio.hidden = visibles !== 0;
  }

  if (buscar) buscar.addEventListener('input', aplicar);

  document.querySelectorAll('.filtro').forEach(function (boton) {
    boton.addEventListener('click', function () {
      document.querySelectorAll('.filtro').forEach(function (b) { b.classList.remove('filtro--activo'); });
      boton.classList.add('filtro--activo');
      categoria = boton.dataset.filtro || '';
      aplicar();
    });
  });

  aplicar();
})();
