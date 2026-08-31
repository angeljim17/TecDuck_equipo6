/**
 * Helpers de DOM del quiz (vidas, progreso, opciones, feedback).
 */
(function () {
  "use strict";

  function pintarVidas(vidas) {
    var el = document.getElementById("quiz-hearts");
    if (el) {
      el.textContent = "❤️".repeat(vidas) + "🤍".repeat(3 - vidas);
    }
  }

  function pintarProgreso(indice, total) {
    var el = document.getElementById("quiz-progress");
    if (el) {
      el.textContent = indice + 1 + " / " + total;
    }
  }

  function pintarSaldo(opts) {
    opts = opts || {};
    var wrap = document.getElementById("quiz-saldo-wrap");
    var totalEl = document.getElementById("quiz-saldo-total");
    var hintEl = document.getElementById("quiz-saldo-hint");
    var pill = document.getElementById("quiz-saldo-pill");
    if (!wrap || !totalEl) {
      return;
    }

    var base = opts.saldoBase || 0;
    var pendiente = Math.max(
      0,
      (opts.monedasGanadas || 0) - (opts.monedasServidor || 0)
    );
    var total = base + pendiente;
    totalEl.textContent = String(total);

    if (hintEl) {
      hintEl.classList.remove("quiz-saldo-hint--earned");
      if (
        !opts.respondidaBien &&
        !opts.partidaTerminada &&
        opts.listaLength &&
        !opts.quizModoPreview
      ) {
        var n = opts.monedasSiAcierta(opts.erroresOpcion);
        hintEl.textContent = "+" + n + " si aciertas";
        hintEl.hidden = false;
      } else if (opts.monedasRecienGanadas > 0) {
        hintEl.textContent = "+" + opts.monedasRecienGanadas + " ganadas";
        hintEl.hidden = false;
        hintEl.classList.add("quiz-saldo-hint--earned");
      } else {
        hintEl.hidden = true;
      }
    }

    if (opts.animarMonedas && pill) {
      pill.classList.remove("quiz-saldo-pill--pulse");
      void pill.offsetWidth;
      pill.classList.add("quiz-saldo-pill--pulse");
    }
  }

  function animarMonedasGanadas(cantidad, origenEl) {
    var pill = document.getElementById("quiz-saldo-pill");
    if (!pill || !cantidad || cantidad <= 0) {
      return;
    }

    var destRect = pill.getBoundingClientRect();
    var origenRect = origenEl
      ? origenEl.getBoundingClientRect()
      : null;
    if (!origenRect) {
      var caja = document.querySelector(".quiz-box");
      origenRect = caja
        ? caja.getBoundingClientRect()
        : {
            left: window.innerWidth * 0.5,
            top: window.innerHeight * 0.55,
            width: 0,
            height: 0
          };
    }

    var origenX = origenRect.left + origenRect.width / 2;
    var origenY = origenRect.top + origenRect.height / 2;
    var destinoX = destRect.left + destRect.width / 2;
    var destinoY = destRect.top + destRect.height / 2;
    var numMonedas = Math.min(5, Math.max(3, Math.ceil(cantidad / 4)));

    for (var i = 0; i < numMonedas; i++) {
      (function (idx) {
        setTimeout(function () {
          var spreadOrigen = (idx - (numMonedas - 1) / 2) * 10;
          var spreadDestino = (idx - (numMonedas - 1) / 2) * 4;
          var inicioX = origenX + spreadOrigen;
          var inicioY = origenY + (idx % 2) * 4;
          var finX = destinoX + spreadDestino;
          var finY = destinoY;
          var dx = finX - inicioX;
          var dy = finY - inicioY;
          var mx = dx * 0.55;
          var my = dy * 0.5 - Math.min(22, Math.abs(dy) * 0.12);

          var moneda = document.createElement("span");
          moneda.className = "quiz-coin-drop";
          moneda.setAttribute("aria-hidden", "true");
          moneda.textContent = "🪙";
          moneda.style.left = inicioX + "px";
          moneda.style.top = inicioY + "px";
          document.body.appendChild(moneda);

          function tx(x, y, scale, rot) {
            return (
              "translate(-50%, -50%) translate(" +
              x +
              "px, " +
              y +
              "px) scale(" +
              scale +
              ") rotate(" +
              rot +
              "deg)"
            );
          }

          var anim = moneda.animate(
            [
              {
                transform: tx(0, 0, 0.45, -18),
                opacity: 0
              },
              {
                transform: tx(0, 0, 0.7, -10),
                opacity: 1,
                offset: 0.12
              },
              {
                transform: tx(mx, my, 1.05, 8),
                opacity: 1,
                offset: 0.55
              },
              {
                transform: tx(dx * 0.96, dy * 0.96, 0.9, 2),
                opacity: 0.85,
                offset: 0.82
              },
              {
                transform: tx(dx, dy, 0.65, 0),
                opacity: 0
              }
            ],
            {
              duration: 640,
              easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              fill: "forwards"
            }
          );

          anim.onfinish = function () {
            moneda.remove();
          };
          setTimeout(function () {
            if (moneda.parentNode) {
              moneda.remove();
            }
          }, 800);
        }, idx * 90);
      })(i);
    }

    setTimeout(function () {
      pill.classList.remove("quiz-saldo-pill--pulse");
      void pill.offsetWidth;
      pill.classList.add("quiz-saldo-pill--pulse");
    }, numMonedas * 90 + 220);
  }

  function deshabilitarOpciones() {
    var opts = document.querySelectorAll("#quiz-options .option");
    for (var i = 0; i < opts.length; i++) {
      opts[i].disabled = true;
    }
  }

  function habilitarOpciones() {
    var opts = document.querySelectorAll("#quiz-options .option");
    for (var i = 0; i < opts.length; i++) {
      opts[i].disabled = false;
    }
  }

  function limpiarClasesOpciones() {
    var opts = document.querySelectorAll("#quiz-options .option");
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.remove("correct", "wrong", "option-elegida");
    }
  }

  function ocultarConfirmar(onClear) {
    if (typeof onClear === "function") {
      onClear();
    }
    var btn = document.getElementById("quiz-confirmar");
    if (btn) {
      btn.hidden = true;
    }
  }

  function mostrarConfirmar(mostrar) {
    var btn = document.getElementById("quiz-confirmar");
    if (btn && mostrar) {
      btn.hidden = false;
    }
  }

  function ocultarFeedback() {
    var fb = document.getElementById("quiz-feedback");
    if (fb) {
      fb.hidden = true;
      fb.textContent = "";
    }
  }

  function ocultarSiguiente() {
    var sig = document.getElementById("quiz-siguiente");
    if (sig) {
      sig.hidden = true;
      sig.onclick = null;
    }
  }

  function mostrarSiguiente(texto, onClick) {
    var sig = document.getElementById("quiz-siguiente");
    if (!sig) {
      return;
    }
    sig.textContent = texto;
    sig.hidden = false;
    sig.onclick = onClick;
  }

  function mostrarFeedback(texto) {
    var fb = document.getElementById("quiz-feedback");
    if (!fb) {
      return;
    }
    fb.innerHTML = "";
    var titulo = document.createElement("span");
    titulo.className = "quiz-feedback-title";
    titulo.textContent = "Retroalimentación";
    var cuerpo = document.createElement("span");
    cuerpo.textContent = texto;
    fb.appendChild(titulo);
    fb.appendChild(cuerpo);
    fb.hidden = false;
  }

  function quizStr(key, fallback, vars) {
    var txt =
      typeof str === "function" ? str("quiz." + key, fallback) : fallback;
    if (vars && txt) {
      Object.keys(vars).forEach(function (k) {
        txt = txt.replace("{" + k + "}", String(vars[k]));
      });
    }
    return txt;
  }

  function ocultarAreaPreguntaQuiz() {
    var ids = [
      "quiz-question-text",
      "quiz-options",
      "quiz-confirmar",
      "quiz-feedback",
      "quiz-siguiente"
    ];
    for (var i = 0; i < ids.length; i++) {
      var node = document.getElementById(ids[i]);
      if (node) {
        node.hidden = true;
      }
    }
    var mapa = document.getElementById("quiz-jxg-panel");
    if (mapa) {
      mapa.hidden = true;
    }
    if (typeof QuizJXGMapaFijo !== "undefined") {
      QuizJXGMapaFijo.ocultar();
    }
  }

  function pintarConfettiCelebracion(contenedor) {
    if (!contenedor) {
      return;
    }
    contenedor.innerHTML = "";
    var colores = ["#facc15", "#fb923c", "#f472b6", "#38bdf8", "#4ade80", "#c084fc"];
    for (var i = 0; i < 24; i++) {
      var p = document.createElement("span");
      p.className = "quiz-celebration-particle";
      p.style.setProperty("--i", String(i));
      p.style.setProperty("--x", String(Math.random() * 100) + "%");
      p.style.setProperty("--delay", (Math.random() * 0.45).toFixed(2) + "s");
      p.style.setProperty("--dur", (2.2 + Math.random() * 1.4).toFixed(2) + "s");
      p.style.background = colores[i % colores.length];
      contenedor.appendChild(p);
    }
  }

  function mostrarCelebracionNivel(opts) {
    opts = opts || {};
    ocultarSiguiente();
    ocultarConfirmar();
    ocultarFeedback();
    ocultarAreaPreguntaQuiz();

    var cel = document.getElementById("quiz-celebration");
    if (!cel) {
      return;
    }

    var titulo = document.getElementById("quiz-celebration-title");
    var sub = document.getElementById("quiz-celebration-sub");
    var stats = document.getElementById("quiz-celebration-stats");
    var retry = document.getElementById("quiz-celebration-retry");
    var particulas = document.getElementById("quiz-celebration-particles");

    if (titulo) {
      titulo.textContent = opts.preview
        ? quizStr("celebracionPreview", "¡Vista previa completada!")
        : quizStr("celebracionTitulo", "¡Nivel completado!");
    }
    if (sub) {
      sub.textContent = quizStr(
        "celebracionSub",
        "¡Lo lograste! Tec-Duck está muy orgulloso de ti."
      );
    }
    if (stats) {
      stats.textContent = quizStr("celebracionGuardando", "Guardando tu progreso…");
      stats.classList.remove("quiz-celebration-stats--error");
    }
    if (retry) {
      retry.hidden = true;
      retry.onclick = null;
    }

    var sigHide = document.getElementById("quiz-celebration-siguiente");
    if (sigHide) {
      sigHide.hidden = true;
    }

    pintarConfettiCelebracion(particulas);
    cel.hidden = false;
    document.body.classList.add("quiz--celebracion");

    var box = document.querySelector(".quiz-box");
    if (box) {
      box.classList.add("quiz-box--celebracion");
    }
  }

  function actualizarCelebracionNivel(data) {
    data = data || {};
    var stats = document.getElementById("quiz-celebration-stats");
    var retry = document.getElementById("quiz-celebration-retry");
    if (!stats) {
      return;
    }

    if (data.error) {
      stats.textContent = data.mensaje ||
        quizStr(
          "celebracionError",
          "Completaste el nivel, pero no se pudo guardar. Revisa tu conexión."
        );
      stats.classList.add("quiz-celebracion-stats--error");
      if (retry && typeof data.onReintentar === "function") {
        retry.hidden = false;
        retry.onclick = data.onReintentar;
      }
      return;
    }

    stats.classList.remove("quiz-celebracion-stats--error");
    if (retry) {
      retry.hidden = true;
      retry.onclick = null;
    }

    var ok = data.aciertos != null ? data.aciertos : 0;
    var total = data.total != null ? data.total : 0;
    if (data.preview) {
      stats.textContent = quizStr("celebracionStatsPreview", ok + "/" + total + " aciertos", {
        ok: ok,
        total: total
      });
      return;
    }
    stats.textContent = quizStr(
      "celebracionStats",
      ok + "/" + total + " aciertos · +" + (data.monedas || 0) + " monedas",
      {
        ok: ok,
        total: total,
        monedas: data.monedas || 0
      }
    );
    if (data.monedas > 0) {
      var pill = document.getElementById("quiz-saldo-pill");
      if (pill) {
        pill.classList.remove("quiz-saldo-pill--pulse");
        void pill.offsetWidth;
        pill.classList.add("quiz-saldo-pill--pulse");
      }
    }

    var sig = document.getElementById("quiz-celebration-siguiente");
    if (sig) {
      if (data.siguienteNivelUrl) {
        sig.href = data.siguienteNivelUrl;
        sig.textContent = quizStr("celebracionSiguiente", "Siguiente nivel →");
        sig.hidden = false;
      } else {
        sig.hidden = true;
        sig.removeAttribute("href");
      }
    }
  }

  function restaurarAreaPreguntaQuiz() {
    var q = document.getElementById("quiz-question-text");
    var opts = document.getElementById("quiz-options");
    if (q) {
      q.hidden = false;
    }
    if (opts) {
      opts.hidden = false;
    }
  }

  function ocultarGameOverPanel() {
    var panel = document.getElementById("quiz-gameover-panel");
    if (panel) {
      panel.hidden = true;
    }
    document.body.classList.remove("quiz--gameover");
    var box = document.querySelector(".quiz-box");
    if (box) {
      box.classList.remove("quiz-box--gameover");
    }
    var legacy = document.getElementById("quiz-gameover");
    if (legacy) {
      legacy.hidden = true;
    }
    restaurarAreaPreguntaQuiz();
  }

  function mostrarGameOverPanel(opts) {
    opts = opts || {};
    ocultarAreaPreguntaQuiz();
    ocultarCelebracionNivel();

    var panel = document.getElementById("quiz-gameover-panel");
    if (!panel) {
      return;
    }

    var titulo = document.getElementById("quiz-gameover-title");
    var sub = document.getElementById("quiz-gameover-sub");
    var btnRetry = document.getElementById("quiz-gameover-reintentar");
    var linkTemas = document.getElementById("quiz-gameover-temas");

    if (titulo) {
      titulo.textContent = quizStr("gameoverTitulo", "Sin vidas");
    }
    if (sub) {
      sub.textContent = quizStr(
        "gameoverSub",
        "No te rindas: repasa el tema e inténtalo otra vez."
      );
    }
    if (btnRetry) {
      btnRetry.textContent = quizStr("gameoverReintentar", "Reintentar");
      btnRetry.onclick = typeof opts.onReintentar === "function" ? opts.onReintentar : null;
    }
    if (linkTemas) {
      linkTemas.textContent = quizStr("gameoverTemas", "Volver a temas");
      if (typeof pagina === "function") {
        linkTemas.href = pagina("topics.html");
      }
    }

    panel.hidden = false;
    document.body.classList.add("quiz--gameover");
    var box = document.querySelector(".quiz-box");
    if (box) {
      box.classList.add("quiz-box--gameover");
    }
  }

  var _quizModalResolver = null;

  function marcarQuizModalAbierto(abierto) {
    if (abierto) {
      document.body.classList.add("quiz-modal-open");
    } else {
      document.body.classList.remove("quiz-modal-open");
    }
    var bloquear = document.querySelectorAll(
      ".quiz-top, .quiz-box, .quiz-nav, .quiz-preview-banner"
    );
    for (var i = 0; i < bloquear.length; i++) {
      var node = bloquear[i];
      if (abierto) {
        node.setAttribute("inert", "");
        node.setAttribute("aria-hidden", "true");
      } else {
        node.removeAttribute("inert");
        node.removeAttribute("aria-hidden");
      }
    }
  }

  function cerrarQuizModal(resultado) {
    var modal = document.getElementById("quiz-modal");
    if (modal) {
      modal.hidden = true;
    }
    marcarQuizModalAbierto(false);
    if (_quizModalResolver) {
      var resolve = _quizModalResolver;
      _quizModalResolver = null;
      resolve(!!resultado);
    }
  }

  function quizConfirmarModal(opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var modal = document.getElementById("quiz-modal");
      var titulo = document.getElementById("quiz-modal-title");
      var cuerpo = document.getElementById("quiz-modal-body");
      var confirm = document.getElementById("quiz-modal-confirm");
      if (!modal || !titulo || !cuerpo || !confirm) {
        resolve(false);
        return;
      }
      _quizModalResolver = resolve;
      titulo.textContent = opts.titulo || "";
      cuerpo.textContent = opts.cuerpo || "";
      confirm.textContent = opts.confirmarTexto || "Confirmar";
      confirm.classList.remove("quiz-modal-btn--danger");
      if (opts.variant === "danger") {
        confirm.classList.add("quiz-modal-btn--danger");
      }
      modal.hidden = false;
      marcarQuizModalAbierto(true);
      confirm.onclick = function () {
        cerrarQuizModal(true);
      };
      var cancelBtns = modal.querySelectorAll("[data-quiz-modal-cancel]");
      for (var i = 0; i < cancelBtns.length; i++) {
        cancelBtns[i].onclick = function () {
          cerrarQuizModal(false);
        };
      }
      window.requestAnimationFrame(function () {
        try {
          confirm.focus({ preventScroll: true });
        } catch (e) {
          /* noop */
        }
      });
    });
  }

  function registrarQuizModalTecla() {
    if (document.body.getAttribute("data-quiz-modal-keys") === "1") {
      return;
    }
    document.body.setAttribute("data-quiz-modal-keys", "1");
    document.addEventListener("keydown", function (ev) {
      var modal = document.getElementById("quiz-modal");
      if (!modal || modal.hidden) {
        return;
      }
      if (ev.key === "Escape") {
        ev.preventDefault();
        cerrarQuizModal(false);
      }
    });
  }

  registrarQuizModalTecla();

  function ocultarCelebracionNivel() {
    var cel = document.getElementById("quiz-celebration");
    if (cel) {
      cel.hidden = true;
    }
    document.body.classList.remove("quiz--celebracion");
    var box = document.querySelector(".quiz-box");
    if (box) {
      box.classList.remove("quiz-box--celebracion");
    }
    var q = document.getElementById("quiz-question-text");
    var opts = document.getElementById("quiz-options");
    if (q) {
      q.hidden = false;
    }
    if (opts) {
      opts.hidden = false;
    }
  }

  function mostrarCargandoQuiz() {
    document.body.classList.add("is-quiz-loading");
    var overlay = document.getElementById("quiz-loading-overlay");
    if (overlay) {
      overlay.classList.remove("is-hidden");
      try {
        overlay.focus({ preventScroll: true });
      } catch (e) {
        /* noop */
      }
    }
  }

  function ocultarCargandoQuiz() {
    document.body.classList.remove("is-quiz-loading");
    var overlay = document.getElementById("quiz-loading-overlay");
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
  }

  window.QuizUi = {
    pintarVidas: pintarVidas,
    pintarProgreso: pintarProgreso,
    pintarSaldo: pintarSaldo,
    animarMonedasGanadas: animarMonedasGanadas,
    deshabilitarOpciones: deshabilitarOpciones,
    habilitarOpciones: habilitarOpciones,
    limpiarClasesOpciones: limpiarClasesOpciones,
    ocultarConfirmar: ocultarConfirmar,
    mostrarConfirmar: mostrarConfirmar,
    ocultarFeedback: ocultarFeedback,
    ocultarSiguiente: ocultarSiguiente,
    mostrarSiguiente: mostrarSiguiente,
    mostrarFeedback: mostrarFeedback,
    mostrarCelebracionNivel: mostrarCelebracionNivel,
    actualizarCelebracionNivel: actualizarCelebracionNivel,
    ocultarCelebracionNivel: ocultarCelebracionNivel,
    ocultarAreaPreguntaQuiz: ocultarAreaPreguntaQuiz,
    mostrarGameOverPanel: mostrarGameOverPanel,
    ocultarGameOverPanel: ocultarGameOverPanel,
    quizConfirmarModal: quizConfirmarModal,
    mostrarCargandoQuiz: mostrarCargandoQuiz,
    ocultarCargandoQuiz: ocultarCargandoQuiz
  };
})();
