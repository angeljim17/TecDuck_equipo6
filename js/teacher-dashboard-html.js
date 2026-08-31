/**
 * Helpers HTML del panel del maestro (barras, escape, fechas).
 */
(function () {
  "use strict";

  function escHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function barraHtml(puntos, max, etiqueta, colorClass) {
    max = max || 10;
    var pct = Math.max(0, Math.min(100, Math.round((puntos / max) * 100)));
    var cls = colorClass || teacherColorBarra(puntos, max);
    var label =
      etiqueta != null
        ? etiqueta
        : max === 100
          ? pct + "%"
          : puntos + "/" + max;
    return (
      '<div class="teacher-bar-wrap ' +
      cls +
      '">' +
      '<div class="teacher-bar-track"><div class="teacher-bar-fill" style="width:' +
      pct +
      '%"></div></div>' +
      '<span class="teacher-bar-score">' +
      label +
      "</span></div>"
    );
  }

  function htmlCeldaTemaFijo(alumno, temaId, temaLabel) {
    var facil =
      typeof teacherTemaModoCelda === "function"
        ? teacherTemaModoCelda(alumno, temaId, "facil")
        : { pts: 0, enCurso: false };
    var dificil =
      typeof teacherTemaModoCelda === "function"
        ? teacherTemaModoCelda(alumno, temaId, "dificil")
        : { pts: 0, enCurso: false };
    var titulo = temaLabel || temaId;
    return (
      '<div class="teacher-tema-dual" title="' +
      escHtml(titulo + " · B = Básico, A = Avanzado") +
      '">' +
      '<div class="teacher-tema-dual-row" title="' +
      escHtml(titulo + " · Básico") +
      '">' +
      '<span class="teacher-tema-dual-label">B</span>' +
      barraHtml(facil.pts, 10, null, facil.enCurso ? "bar-blue" : null) +
      "</div>" +
      '<div class="teacher-tema-dual-row" title="' +
      escHtml(titulo + " · Avanzado") +
      '">' +
      '<span class="teacher-tema-dual-label">A</span>' +
      barraHtml(dificil.pts, 10, null, dificil.enCurso ? "bar-blue" : null) +
      "</div></div>"
    );
  }

  function barraPorcentajeAciertosHtml(pct) {
    return barraHtml(pct, 100, pct + "%");
  }

  function intentoEnCurso(intento) {
    return (
      intento &&
      String(intento.estado || "").toUpperCase() === "EN_CURSO"
    );
  }

  function barraPracticaMaestroHtml(ok, total, enCurso) {
    ok = ok || 0;
    total = total || 0;
    if (!total) {
      return barraHtml(0, 1, "0/0", enCurso ? "bar-blue" : null);
    }
    return barraHtml(ok, total, null, enCurso ? "bar-blue" : null);
  }

  function barraNivelCompletoHtml(ok, total, enCurso) {
    ok = ok || 0;
    total = total || 10;
    return barraHtml(ok, total, ok + "/" + total, enCurso ? "bar-blue" : null);
  }

  function etiquetaBarraNivelIntento(intento) {
    if (typeof teacherEtiquetaBarraNivel === "function") {
      return teacherEtiquetaBarraNivel(intento && intento.estado);
    }
    return "Progreso del nivel";
  }

  function htmlBarrasIntento(intento) {
    var enCurso = intentoEnCurso(intento);
    var etiqueta = etiquetaBarraNivelIntento(intento);
    if (!intento) {
      return (
        '<div class="teacher-intento-bars">' +
        '<div class="teacher-intento-bar">' +
        '<span class="teacher-intento-bar-label">' +
        escHtml(etiqueta) +
        "</span>" +
        barraNivelCompletoHtml(0, 10) +
        "</div></div>"
      );
    }
    return (
      '<div class="teacher-intento-bars">' +
      '<div class="teacher-intento-bar">' +
      '<span class="teacher-intento-bar-label">' +
      escHtml(etiqueta) +
      "</span>" +
      barraNivelCompletoHtml(
        intento.nivelCompletoOk,
        intento.nivelCompletoTotal || intento.total,
        enCurso
      ) +
      "</div></div>"
    );
  }

  function formatearFechaPartida(iso) {
    if (!iso) {
      return "—";
    }
    try {
      var d = new Date(iso);
      return d.toLocaleString("es-MX", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return String(iso);
    }
  }

  function claseEstadoIntento(estado) {
    var e = String(estado || "").toUpperCase();
    if (e === "COMPLETADA") {
      return "teacher-intento--ok";
    }
    if (e === "GAME_OVER") {
      return "teacher-intento--fail";
    }
    if (e === "ABANDONADA") {
      return "teacher-intento--warn";
    }
    if (e === "EN_CURSO") {
      return "teacher-intento--curso";
    }
    return "";
  }

  function htmlResultadoTarea(t, estadoPartida) {
    var est = String(estadoPartida || "").toUpperCase();
    if (est === "GAME_OVER" && t.omitida) {
      return '<span class="task-omitida">No contestada</span>';
    }
    if (
      est === "EN_CURSO" &&
      (t.enCurso || (t.contestada === false && !t.ok && !t.omitida))
    ) {
      return '<span class="task-partial">En curso</span>';
    }
    if (t.contestada === false && !t.ok) {
      return '<span class="task-fail">✗</span>';
    }
    return (
      "<span class='" +
      (t.ok ? "task-ok" : "task-fail") +
      "'>" +
      (t.ok ? "✓" : "✗") +
      "</span>"
    );
  }

  window.TeacherDashHtml = {
    escHtml: escHtml,
    barraHtml: barraHtml,
    htmlCeldaTemaFijo: htmlCeldaTemaFijo,
    barraPorcentajeAciertosHtml: barraPorcentajeAciertosHtml,
    intentoEnCurso: intentoEnCurso,
    barraPracticaMaestroHtml: barraPracticaMaestroHtml,
    barraNivelCompletoHtml: barraNivelCompletoHtml,
    htmlBarrasIntento: htmlBarrasIntento,
    formatearFechaPartida: formatearFechaPartida,
    claseEstadoIntento: claseEstadoIntento,
    htmlResultadoTarea: htmlResultadoTarea
  };
})();
