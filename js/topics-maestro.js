// Niveles creados por el maestro en «Elige tu tema»: mismas tarjetas visuales que los temas del catálogo.
(function () {
  "use strict";

  var RUTA_LOGO_DEFAULT = "../MAIN DUCK/BACKGROUND/Quiz_default.png";
  var RUTA_TIMEOUT = "../MAIN DUCK/BACKGROUND/Timeout.png";

  // Escapa texto para meterlo seguro dentro de HTML.
  function escHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Igual que escHtml pero también escapa comillas simples para atributos.
  function escAttr(s) {
    return escHtml(s).replace(/'/g, "&#39;");
  }

  function idNivelParaQuiz(nivel) {
    if (typeof nivelMaestroIdPublico === "function") {
      return nivelMaestroIdPublico(nivel);
    }
    var raw = nivel && (nivel.dbId != null ? nivel.dbId : nivel.id);
    var num = parseInt(String(raw || "").trim(), 10);
    return isNaN(num) || num <= 0 ? null : String(num);
  }

  function urlQuizNivelMaestro(nivel) {
    var id = typeof nivel === "object" ? idNivelParaQuiz(nivel) : idNivelParaQuiz({ id: nivel, dbId: nivel });
    if (!id) {
      return null;
    }
    if (typeof paginaQuizMaestro === "function") {
      return paginaQuizMaestro(id);
    }
    return "quiz?tn=" + encodeURIComponent(id);
  }

  function irQuizNivelMaestro(nivel) {
    var id = idNivelParaQuiz(nivel);
    var url = urlQuizNivelMaestro(nivel);
    if (!id || !url) {
      console.warn("[topics-maestro] Nivel sin id de base de datos:", nivel);
      if (typeof uiToastError === "function") {
        uiToastError("Este nivel aún no se puede abrir. Avísale a tu maestro.");
      }
      return;
    }
    try {
      sessionStorage.setItem("tec_duck_quiz_tn", id);
    } catch (e) {
      /* noop */
    }
    window.location.assign(url);
  }

  // Resuelve la URL del logo del nivel maestro o usa la imagen por defecto.
  function urlLogoNivel(nivel) {
    if (typeof nivelMaestroUrlLogo === "function") {
      return nivelMaestroUrlLogo(nivel);
    }
    if (
      typeof nivelMaestroEsLogoValido === "function" &&
      nivelMaestroEsLogoValido(nivel && nivel.logo)
    ) {
      return nivel.logo;
    }
    return RUTA_LOGO_DEFAULT;
  }

  // Quita del grid las tarjetas de niveles maestro que ya estaban pintadas.
  function quitarTarjetasMaestro(grid) {
    var previas = grid.querySelectorAll("[data-maestro-nivel]");
    for (var i = 0; i < previas.length; i++) {
      previas[i].remove();
    }
  }

  function maestroVenceManana(fechaLimite) {
    if (!fechaLimite || typeof nivelMaestroParseFechaLimite !== "function") {
      return false;
    }
    var fin = nivelMaestroParseFechaLimite(fechaLimite);
    if (!fin) {
      return false;
    }
    var manana = new Date();
    manana.setHours(0, 0, 0, 0);
    manana.setDate(manana.getDate() + 1);
    var finDia = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate());
    return finDia.getTime() === manana.getTime();
  }

  function ordenarNivelesPorFechaLimite(niveles, grupoId) {
    return niveles.slice().sort(function (a, b) {
      function ts(nivel) {
        var asig =
          nivel.grupos && nivel.grupos[grupoId]
            ? nivel.grupos[grupoId]
            : null;
        var fl = asig && asig.fechaLimite;
        if (!fl || typeof nivelMaestroParseFechaLimite !== "function") {
          return Number.MAX_SAFE_INTEGER;
        }
        var d = nivelMaestroParseFechaLimite(fl);
        return d ? d.getTime() : Number.MAX_SAFE_INTEGER;
      }
      return ts(a) - ts(b);
    });
  }

  // Construye una tarjeta de tema para un nivel del maestro (jugable o vencido).
  function crearTarjetaTema(nivel, vinculo) {
    var asig = nivel.grupos[vinculo.grupoId] || {};
    var vencido =
      typeof nivelMaestroFechaVencida === "function" &&
      nivelMaestroFechaVencida(nivel, vinculo.grupoId);
    var fechaTxt =
      typeof nivelMaestroEtiquetaFecha === "function"
        ? nivelMaestroEtiquetaFecha(asig.fechaLimite)
        : "";
    var meta =
      typeof nivelMaestroEtiquetaResumen === "function"
        ? nivelMaestroEtiquetaResumen(nivel)
        : "";
    var tagline = meta;
    if (fechaTxt && fechaTxt !== "Sin fecha límite") {
      tagline = tagline + " · Límite: " + fechaTxt;
    }
    var nivelHtml = "";
    if (vencido) {
      nivelHtml =
        '<span class="level-btn level-facil level-maestro-locked" role="presentation">' +
        htmlContenidoBotonNivel("🔒", "Jugar", "No disponible", false) +
        "</span>";
    } else {
      var idQuiz = idNivelParaQuiz(nivel);
      var urlQuiz = idQuiz ? urlQuizNivelMaestro(nivel) : null;
      var numPreg =
        typeof nivelMaestroContarPreguntas === "function"
          ? nivelMaestroContarPreguntas(nivel)
          : 0;
      if (
        idQuiz &&
        numPreg > 0 &&
        typeof progresoMaestroRegistrarTotal === "function"
      ) {
        progresoMaestroRegistrarTotal(idQuiz, numPreg);
      }
      if (urlQuiz) {
        nivelHtml =
          '<a href="' +
          escAttr(urlQuiz) +
          '" class="level-btn level-facil" data-maestro-progress="' +
          escAttr(idQuiz) +
          '" data-maestro-total="' +
          escAttr(String(numPreg)) +
          '" data-quiz-maestro="1" data-quiz-nav="1">' +
          htmlContenidoBotonNivel("A", "Jugar", "Jugar →", true) +
          "</a>";
      } else {
        nivelHtml =
          '<span class="level-btn level-facil level-maestro-locked" role="presentation">' +
          htmlContenidoBotonNivel("…", "Jugar", "No disponible", false) +
          "</span>";
      }
    }

    var card = document.createElement("article");
    card.className =
      "topic-card c-maestro-nivel" + (vencido ? " c-maestro-nivel--vencido" : "");
    card.setAttribute("data-maestro-nivel", idNivelParaQuiz(nivel) || "");

    var badgeVence =
      !vencido && maestroVenceManana(asig.fechaLimite)
        ? '<span class="c-maestro-vence-badge">' +
          escHtml(
            typeof str === "function"
              ? str("topics.venceManana", "Vence mañana")
              : "Vence mañana"
          ) +
          "</span>"
        : "";

    card.innerHTML =
      (vencido
        ? '<span class="c-maestro-vencido-badge" aria-hidden="true">Vencido</span>'
        : badgeVence) +
      '<div class="topic-visual topic-visual--logo' +
      (vencido ? " topic-visual--timeout" : "") +
      '" aria-hidden="true">' +
      '<img class="topic-logo' +
      (vencido ? " topic-logo--timeout" : "") +
      '" src="' +
      escAttr(vencido ? RUTA_TIMEOUT : urlLogoNivel(nivel)) +
      '" alt="" width="142" height="142" />' +
      "</div>" +
      '<div class="topic-body">' +
      "<h2>Del maestro</h2>" +
      '<p class="topic-title">' +
      escHtml(nivel.titulo) +
      "</p>" +
      '<p class="topic-tagline">' +
      escHtml(tagline) +
      "</p>" +
      '<div class="levels">' +
      nivelHtml +
      "</div></div>";

    if (!vencido) {
      var play = card.querySelector("a.level-facil[data-quiz-maestro]");
      if (play) {
        play.addEventListener("click", function (ev) {
          ev.preventDefault();
          irQuizNivelMaestro(nivel);
        });
      }
    }

    return card;
  }

  var pintarSeq = 0;

  // Carga los niveles del maestro del grupo del alumno y los muestra en el grid.
  async function pintar() {
    if (typeof nivelMaestroParaGrupo !== "function") {
      return;
    }
    var seq = ++pintarSeq;
    var seccion = document.getElementById("topics-maestro-niveles");
    var grid = document.getElementById("topics-maestro-grid");
    if (!grid) {
      return;
    }

    quitarTarjetasMaestro(grid);

    var vinculo =
      typeof alumnoObtenerGrupoVinculadoAsync === "function"
        ? await alumnoObtenerGrupoVinculadoAsync()
        : null;

    if (seq !== pintarSeq) {
      return;
    }

    if (!vinculo || !vinculo.grupoId) {
      if (seccion) {
        seccion.hidden = true;
      }
      return;
    }

    if (typeof initSupabase === "function") {
      await initSupabase();
    }

    if (seq !== pintarSeq) {
      return;
    }

    var niveles =
      typeof nivelMaestroParaGrupoAsync === "function"
        ? await nivelMaestroParaGrupoAsync(vinculo.grupoId)
        : nivelMaestroParaGrupo(vinculo.grupoId);

    if (seq !== pintarSeq) {
      return;
    }

    quitarTarjetasMaestro(grid);

    if (!niveles.length) {
      if (seccion) {
        seccion.hidden = true;
      }
      return;
    }

    niveles = ordenarNivelesPorFechaLimite(niveles, vinculo.grupoId);

    if (seccion) {
      seccion.hidden = false;
    }

    var frag = document.createDocumentFragment();
    for (var i = 0; i < niveles.length; i++) {
      frag.appendChild(crearTarjetaTema(niveles[i], vinculo));
    }
    grid.appendChild(frag);
    if (typeof pintarBarrasProgresoNivelesMaestro === "function") {
      pintarBarrasProgresoNivelesMaestro();
    }
    if (typeof actualizarEtiquetasBotonesTemas === "function") {
      actualizarEtiquetasBotonesTemas();
    }
  }

  // Punto de arranque: pinta la sección de niveles del maestro al cargar la página.
  async function iniciar() {
    await pintar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
  window.addEventListener("pageshow", pintar);
})();
