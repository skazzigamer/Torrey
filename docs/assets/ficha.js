// Cambio de imagen principal desde las miniaturas.
(function () {
  var principal = document.getElementById('imagen-principal');
  if (!principal) return;
  document.querySelectorAll('.miniatura').forEach(function (boton) {
    boton.addEventListener('click', function () {
      principal.src = boton.dataset.imagen;
      document.querySelectorAll('.miniatura').forEach(function (b) { b.classList.remove('miniatura--activa'); });
      boton.classList.add('miniatura--activa');
    });
  });
})();
