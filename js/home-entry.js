// Pantalla de inicio: espera el fondo y quita el overlay de carga.
(function () {
  "use strict";

  var BG_URL = "../MAIN DUCK/BACKGROUND/background_1.png";
  var MAX_WAIT_MS = 12000;

  function preloadImagen(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        resolve(true);
      };
      img.onerror = function () {
        resolve(false);
      };
      img.src = url;
    });
  }

  function ocultarOverlay() {
    if (typeof pageLoadOcultar === "function") {
      pageLoadOcultar();
      return;
    }
    document.body.classList.remove("is-page-loading");
    var el = document.getElementById("page-loading-overlay");
    if (el) {
      el.classList.add("is-hidden");
    }
  }

  function iniciar() {
    Promise.race([
      preloadImagen(BG_URL),
      new Promise(function (resolve) {
        setTimeout(resolve, MAX_WAIT_MS);
      })
    ]).then(ocultarOverlay);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
