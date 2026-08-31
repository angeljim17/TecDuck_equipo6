/**
 * Funciones puras reutilizables del quiz (URL, avisos, barajar, monedas).
 */
(function () {
  "use strict";

  function quizSearchParams() {
    var search = window.location.search || "";
    if (!search && window.location.href.indexOf("?") >= 0) {
      search = "?" + window.location.href.split("?")[1].split("#")[0];
    }
    return new URLSearchParams(search);
  }

  function quizNormalizarTnId(raw) {
    if (raw == null) {
      return null;
    }
    var tn = String(raw).trim();
    return tn || null;
  }

  function quizLeerTnPendiente() {
    try {
      return quizNormalizarTnId(sessionStorage.getItem("tec_duck_quiz_tn"));
    } catch (e) {
      return null;
    }
  }

  function quizLimpiarTnPendiente() {
    try {
      sessionStorage.removeItem("tec_duck_quiz_tn");
    } catch (e) {
      /* noop */
    }
  }

  function quizClaveNv(temaId, modo) {
    var t = String(temaId || "1").trim() || "1";
    var m =
      String(modo || "facil").toLowerCase() === "dificil" ? "dificil" : "facil";
    return t + "-" + m;
  }

  function quizParsearNv(raw) {
    if (raw == null) {
      return null;
    }
    var s = String(raw).trim().toLowerCase();
    var m = s.match(/^(\d+)-(facil|dificil)$/);
    if (!m) {
      return null;
    }
    return { temaId: m[1], modo: m[2] };
  }

  /** Lee tema, modo y tn directamente de la URL (?tema= y ?modo=). */
  function quizLeerParamsPartida() {
    var params = quizSearchParams();
    var modoRaw = String(params.get("modo") || "facil")
      .trim()
      .toLowerCase();
    return {
      tnId: params.get("tn"),
      temaId: String(params.get("tema") || "1").trim() || "1",
      modo: modoRaw === "dificil" ? "dificil" : "facil",
      preview: params.get("preview") === "1"
    };
  }

  function quizEsPartidaNivelMaestro(conf) {
    conf = conf || quizLeerParamsPartida();
    return !!quizNormalizarTnId(conf.tnId);
  }

  function quizTemaDbIdDesdeCodigo(codigo) {
    var c = String(codigo || "1").trim() || "1";
    if (typeof TEC_DUCK_TEMAS !== "undefined" && Array.isArray(TEC_DUCK_TEMAS)) {
      for (var i = 0; i < TEC_DUCK_TEMAS.length; i++) {
        var t = TEC_DUCK_TEMAS[i];
        if (t && String(t.codigo) === c) {
          var dbId = parseInt(t.dbId, 10);
          if (!isNaN(dbId) && dbId > 0) {
            return dbId;
          }
        }
      }
    }
    var n = parseInt(c, 10);
    return !isNaN(n) && n > 0 ? n : 1;
  }

  function quizAvisar(msg) {
    if (typeof uiToastError === "function") {
      uiToastError(msg);
    } else {
      window.alert(msg);
    }
  }

  function barajar(arr) {
    var copia = arr.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copia[i];
      copia[i] = copia[j];
      copia[j] = tmp;
    }
    return copia;
  }

  function monedasQuizSiAhoraAcierta(numFallosYa) {
    if (numFallosYa <= 0) {
      return 10;
    }
    if (numFallosYa === 1) {
      return 5;
    }
    return 2;
  }

  window.QuizHelpers = {
    quizSearchParams: quizSearchParams,
    quizNormalizarTnId: quizNormalizarTnId,
    quizLeerTnPendiente: quizLeerTnPendiente,
    quizLimpiarTnPendiente: quizLimpiarTnPendiente,
    quizClaveNv: quizClaveNv,
    quizParsearNv: quizParsearNv,
    quizLeerParamsPartida: quizLeerParamsPartida,
    quizTemaDbIdDesdeCodigo: quizTemaDbIdDesdeCodigo,
    quizEsPartidaNivelMaestro: quizEsPartidaNivelMaestro,
    quizAvisar: quizAvisar,
    barajar: barajar,
    monedasQuizSiAhoraAcierta: monedasQuizSiAhoraAcierta
  };
})();
