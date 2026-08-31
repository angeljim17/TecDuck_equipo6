// Helpers de URLs para páginas en /pages/. Con npx serve las rutas relativas
// se rompen, así que todo apunta a rutas absolutas.
(function () {
  "use strict";

  var BASE = "/pages/";

  // Arma la ruta completa: /pages/ + nombre de archivo.
  window.pagina = function (archivo) {
    return BASE + String(archivo || "").replace(/^\//, "");
  };

  // topics.html
  window.paginaTopics = function () {
    return pagina("topics.html");
  };

  // URL del quiz con tema y modo (facil o dificil) en query string.
  // Usar /pages/quiz sin .html: serve redirige quiz.html → quiz y pierde ?tema=&modo=
  window.paginaQuiz = function (tema, modoQuiz) {
    var t = encodeURIComponent(String(tema || "1"));
    var m =
      String(modoQuiz || "facil").toLowerCase() === "dificil"
        ? "dificil"
        : "facil";
    return pagina("quiz") + "?tema=" + t + "&modo=" + m;
  };

  // Quiz en modo maestro: el nivel va en ?tn=
  window.paginaQuizMaestro = function (nivelId) {
    var num = parseInt(String(nivelId || "").trim(), 10);
    if (isNaN(num) || num <= 0) {
      return pagina("quiz");
    }
    return pagina("quiz") + "?tn=" + encodeURIComponent(String(num));
  };

  // Vista previa del maestro (no guarda progreso del alumno).
  window.paginaQuizMaestroPreview = function (nivelId) {
    return paginaQuizMaestro(nivelId) + "&preview=1";
  };

  // shop.html
  window.paginaShop = function () {
    return pagina("shop.html");
  };

  // customize.html
  window.paginaCustomize = function () {
    return pagina("customize.html");
  };

  // login.html
  window.paginaLogin = function () {
    return pagina("login.html");
  };

  // signup.html
  window.paginaSignup = function () {
    return pagina("signup.html");
  };

  // join-group.html
  window.paginaJoinGroup = function () {
    return pagina("join-group.html");
  };

  // teacher-dashboard.html
  window.paginaTeacherDashboard = function () {
    return pagina("teacher-dashboard.html");
  };

  // teacher-niveles.html
  window.paginaTeacherNiveles = function () {
    return pagina("teacher-niveles.html");
  };

  // Navega directo a una página (location.href).
  window.irPagina = function (archivo) {
    window.location.href = pagina(archivo);
  };
})();
