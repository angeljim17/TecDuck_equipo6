// UI del progreso en la pantalla de temas: botones de nivel avanzado, bloqueos y navegación al quiz.

function etiquetaAccionNivel(slot) {
  if (slot && slot.enCurso) {
    return "Continuar →";
  }
  if (slot && slot.completado) {
    return "Repasar →";
  }
  return "Jugar →";
}

function actualizarEtiquetaGoBoton(btn, slot) {
  if (!btn) {
    return;
  }
  var go = btn.querySelector(".lvl-go");
  if (go) {
    go.textContent = etiquetaAccionNivel(slot);
  }
}

function htmlContenidoBotonNivel(badge, label, go, conBarra) {
  var main =
    '<div class="level-btn-main">' +
    '<span class="lvl-badge">' +
    badge +
    "</span>" +
    '<span class="lvl-label">' +
    label +
    "</span>" +
    '<span class="lvl-go">' +
    go +
    "</span></div>";
  if (!conBarra) {
    return main;
  }
  return (
    main +
    '<div class="level-btn-progress">' +
    '<div class="level-btn-progress-track"><div class="level-btn-progress-fill"></div></div>' +
    '<span class="level-btn-progress-pts">—</span></div>'
  );
}

// Crea el enlace clicable al nivel avanzado cuando ya está desbloqueado.
function crearEnlaceDificil(tema) {
  var a = document.createElement("a");
  a.href =
    typeof paginaQuiz === "function"
      ? paginaQuiz(tema, "dificil")
      : "/pages/quiz?tema=" +
        encodeURIComponent(tema) +
        "&modo=dificil";
  a.className = "level-btn level-btn-2 level-dificil";
  a.setAttribute("data-level-progress", "dificil");
  a.innerHTML = htmlContenidoBotonNivel(
    "B",
    "Nivel avanzado",
    "Jugar →",
    true
  );
  return a;
}

// Placeholder mientras aún no sabemos si el avanzado está desbloqueado o no.
function crearDificilCargando(tema) {
  var span = document.createElement("span");
  span.className =
    "level-btn level-btn-2 level-dificil level-dificil-cargando level-btn--progress-loading";
  span.setAttribute("role", "status");
  span.setAttribute("data-tema-cargando", String(tema));
  span.innerHTML = htmlContenidoBotonNivel("…", "Nivel avanzado", "—", true);
  return span;
}

// Botón del avanzado bloqueado: el alumno aún no completó el básico.
function crearDificilBloqueado(tema) {
  var span = document.createElement("span");
  span.className = diffLinkClassLocked();
  span.setAttribute("role", "presentation");
  var hint =
    typeof str === "function"
      ? str("topics.avanzadoBloqueado", "Completa el nivel básico para desbloquear")
      : "Completa el nivel básico para desbloquear";
  span.setAttribute("title", hint);
  span.innerHTML =
    htmlContenidoBotonNivel("🔒", "Nivel avanzado", "Bloqueado", false) +
    '<span class="level-btn-hint" title="' +
    hint.replace(/"/g, "&quot;") +
    '" aria-label="' +
    hint.replace(/"/g, "&quot;") +
    '">ℹ️</span>';
  return span;
}

// Clases CSS que usa el botón avanzado cuando sigue bloqueado.
function diffLinkClassLocked() {
  return "level-btn level-btn-2 level-dificil level-dificil-locked";
}

function pintarBarraEnBoton(btn, tema, modoKey) {
  if (!btn) {
    return;
  }
  var progress = btn.querySelector(".level-btn-progress");
  if (!progress) {
    return;
  }
  btn.classList.toggle(
    "level-btn--progress-loading",
    !progresoTemasEstaListo()
  );
  if (!progresoTemasEstaListo()) {
    var ptsLoad = progress.querySelector(".level-btn-progress-pts");
    if (ptsLoad) {
      ptsLoad.textContent = "—";
    }
    return;
  }
  var slot =
    typeof progresoTemasModoCelda === "function"
      ? progresoTemasModoCelda(tema, modoKey)
      : { pts: 0, enCurso: false, completado: false };
  pintarBarraEnBotonSlot(btn, progress, slot);
  actualizarEtiquetaGoBoton(btn, slot);
}

function pintarBarraEnBotonMaestro(btn, nivelId) {
  if (!btn) {
    return;
  }
  var progress = btn.querySelector(".level-btn-progress");
  if (!progress) {
    return;
  }
  btn.classList.toggle(
    "level-btn--progress-loading",
    !progresoTemasEstaListo()
  );
  if (!progresoTemasEstaListo()) {
    var ptsLoadM = progress.querySelector(".level-btn-progress-pts");
    if (ptsLoadM) {
      ptsLoadM.textContent = "—";
    }
    return;
  }
  var slot =
    typeof progresoMaestroCelda === "function"
      ? progresoMaestroCelda(nivelId)
      : { ok: 0, total: 0, enCurso: false, completado: false };
  var total = slot.total || 0;
  if (!total && typeof progresoMaestroTotalRegistrado === "function") {
    total = progresoMaestroTotalRegistrado(nivelId);
  }
  if (!total) {
    var attrTotal = parseInt(btn.getAttribute("data-maestro-total") || "", 10);
    if (!isNaN(attrTotal) && attrTotal > 0) {
      total = attrTotal;
    }
  }
  pintarBarraEnBotonSlot(btn, progress, slot, {
    modo: "maestro",
    maxTotal: total
  });
  actualizarEtiquetaGoBoton(btn, slot);
}

function pintarBarraEnBotonSlot(btn, progress, slot, opts) {
  opts = opts || {};
  var val;
  var max;
  if (opts.modo === "maestro") {
    max = Math.max(1, opts.maxTotal || slot.total || 1);
    val = Math.min(max, Math.max(0, slot.ok || 0));
  } else {
    max = 10;
    val = Math.min(10, Math.max(0, slot.pts || 0));
  }
  var fill = progress.querySelector(".level-btn-progress-fill");
  var ptsEl = progress.querySelector(".level-btn-progress-pts");
  if (fill) {
    fill.style.width = Math.round((val / max) * 100) + "%";
  }
  if (ptsEl) {
    ptsEl.textContent = val + "/" + max;
  }
  btn.classList.toggle("is-en-curso", !!slot.enCurso);
  btn.classList.toggle("is-completado", !!slot.completado);
}

function pintarBarrasProgresoNivelesMaestro() {
  var btns = document.querySelectorAll("[data-maestro-progress]");
  for (var i = 0; i < btns.length; i++) {
    var btn = btns[i];
    var nivelId = btn.getAttribute("data-maestro-progress");
    if (!nivelId) {
      continue;
    }
    pintarBarraEnBotonMaestro(btn, nivelId);
  }
}

function pintarBarrasProgresoTemas() {
  var cards = document.querySelectorAll(".topic-card[data-tema]");
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var tema = card.getAttribute("data-tema");
    if (!tema) {
      continue;
    }
    pintarBarraEnBoton(
      card.querySelector(".level-facil[data-level-progress]"),
      tema,
      "facil"
    );
    pintarBarraEnBoton(
      card.querySelector("a.level-dificil[data-level-progress]"),
      tema,
      "dificil"
    );
  }
  pintarBarrasProgresoNivelesMaestro();
}

// Navega al quiz de un tema en el modo indicado (fácil o difícil).
function irQuizTemaModo(tema, modo) {
  var url =
    typeof paginaQuiz === "function"
      ? paginaQuiz(tema, modo)
      : "/pages/quiz?tema=" +
        encodeURIComponent(tema) +
        "&modo=" +
        encodeURIComponent(modo);
  window.location.assign(url);
}

// Enlaza los clics de fácil y difícil en cada tarjeta, respetando bloqueos del avanzado.
function enlazarBotonesQuizTemas() {
  var cards = document.querySelectorAll(".topic-card[data-tema]");
  for (var i = 0; i < cards.length; i++) {
    (function (card) {
      var tema = card.getAttribute("data-tema");
      if (!tema) {
        return;
      }
      var facil = card.querySelector("a.level-facil");
      if (
        facil &&
        facil.getAttribute("data-quiz-nav") !== "1" &&
        !facil.getAttribute("data-maestro-progress") &&
        !facil.getAttribute("data-quiz-maestro")
      ) {
        facil.setAttribute("data-quiz-nav", "1");
        facil.setAttribute(
          "href",
          typeof paginaQuiz === "function"
            ? paginaQuiz(tema, "facil")
            : "/pages/quiz?tema=" +
              encodeURIComponent(tema) +
              "&modo=facil"
        );
        facil.addEventListener("click", function (ev) {
          ev.preventDefault();
          irQuizTemaModo(tema, "facil");
        });
      }
      var dificil = card.querySelector("a.level-dificil");
      if (dificil && dificil.getAttribute("data-quiz-nav") !== "1") {
        dificil.setAttribute("data-quiz-nav", "1");
        dificil.setAttribute(
          "href",
          typeof paginaQuiz === "function"
            ? paginaQuiz(tema, "dificil")
            : "/pages/quiz?tema=" +
              encodeURIComponent(tema) +
              "&modo=dificil"
        );
        dificil.addEventListener("click", function (ev) {
          ev.preventDefault();
          if (!progresoTemasEstaListo()) {
            return;
          }
          if (!isDificilDesbloqueado(tema)) {
            return;
          }
          irQuizTemaModo(tema, "dificil");
        });
      }
    })(cards[i]);
  }
}

// Sustituye el slot del avanzado por “Cargando progreso…” hasta que llegue la respuesta de Supabase.
function progresoTemasBloquearDificilCargando() {
  var cards = document.querySelectorAll(".topic-card[data-tema]");
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var tema = card.getAttribute("data-tema");
    var slot = card.querySelector(
      "a.level-dificil, span.level-dificil-locked, span.level-dificil-cargando"
    );
    if (!slot || !tema) {
      continue;
    }
    slot.parentNode.replaceChild(crearDificilCargando(tema), slot);
  }
  pintarBarrasProgresoTemas();
  enlazarBotonesQuizTemas();
}

// Una vez cargado el progreso, pinta enlace o candado en el avanzado según corresponda.
function aplicarBloqueosTarjetas() {
  if (!progresoTemasEstaListo()) {
    return;
  }
  var cards = document.querySelectorAll(".topic-card[data-tema]");
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var tema = card.getAttribute("data-tema");
    var slot = card.querySelector(
      "a.level-dificil, span.level-dificil-locked, span.level-dificil-cargando"
    );

    if (!slot || !tema) {
      continue;
    }

    if (isDificilDesbloqueado(tema)) {
      if (!slot.matches("a.level-dificil")) {
        slot.parentNode.replaceChild(crearEnlaceDificil(tema), slot);
      }
    } else if (!slot.matches("span.level-dificil-locked")) {
      slot.parentNode.replaceChild(crearDificilBloqueado(tema), slot);
    }
  }
  pintarBarrasProgresoTemas();
  enlazarBotonesQuizTemas();
  actualizarEtiquetasBotonesTemas();
}

function actualizarEtiquetasBotonesTemas() {
  if (!progresoTemasEstaListo()) {
    return;
  }
  var cards = document.querySelectorAll(".topic-card[data-tema]");
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var tema = card.getAttribute("data-tema");
    if (!tema) {
      continue;
    }
    var facil = card.querySelector("a.level-facil[data-level-progress]");
    if (facil) {
      actualizarEtiquetaGoBoton(
        facil,
        progresoTemasModoCelda(tema, "facil")
      );
    }
    var dificil = card.querySelector("a.level-dificil[data-level-progress]");
    if (dificil) {
      actualizarEtiquetaGoBoton(
        dificil,
        progresoTemasModoCelda(tema, "dificil")
      );
    }
  }
  var maestroBtns = document.querySelectorAll("[data-maestro-progress]");
  for (var j = 0; j < maestroBtns.length; j++) {
    var btn = maestroBtns[j];
    var nid = btn.getAttribute("data-maestro-progress");
    if (nid && typeof progresoMaestroCelda === "function") {
      actualizarEtiquetaGoBoton(btn, progresoMaestroCelda(nid));
    }
  }
}
