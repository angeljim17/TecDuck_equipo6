/**
 * Utilidades de sincronización del quiz (actividad, ids, índices).
 * Funciones puras o con contexto explícito; el estado vive en quiz.js.
 */
(function () {
  "use strict";

  function contarPreguntasOkActividad(act) {
    var n = 0;
    for (var i = 0; i < act.length; i++) {
      if (act[i] && act[i].ok) {
        n += 1;
      }
    }
    return n;
  }

  function tiempoPromedioActividad(act) {
    if (!act.length) {
      return 0;
    }
    var sum = 0;
    var n = 0;
    for (var i = 0; i < act.length; i++) {
      if (act[i] && act[i].tiempo != null && act[i].contestada !== false) {
        sum += act[i].tiempo || 0;
        n += 1;
      }
    }
    return n ? Math.round(sum / n) : 0;
  }

  function idsPreguntasLista(arr) {
    var ids = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] && arr[i].id) {
        ids.push(arr[i].id);
      }
    }
    return ids;
  }

  function construirActividadParaGuardar(ctx) {
    var act = [];
    var i;
    var lista = ctx.lista;
    var indice = ctx.indice;
    var porIndice = ctx.porIndice;
    var estadoPartida = ctx.estadoPartida;
    var respondidaBien = ctx.respondidaBien;
    var erroresOpcion = ctx.erroresOpcionIncorrectaEstaPregunta;
    var tiempoSeg = ctx.tiempoSegundosPreguntaActual;
    var textoPreg = ctx.textoPreguntaActual;

    for (i = 0; i < lista.length; i++) {
      var entry = porIndice[i];
      if (entry) {
        act.push({
          indice: entry.indice,
          ok: !!entry.ok,
          errores: entry.errores || 0,
          tiempo: entry.tiempo || 0,
          texto: entry.texto || "",
          contestada: entry.contestada !== false,
          omitida: !!entry.omitida
        });
        continue;
      }
      if (estadoPartida === "GAME_OVER") {
        act.push({
          indice: i,
          ok: false,
          errores: 0,
          tiempo: 0,
          texto: lista[i] ? String(lista[i].q || "").slice(0, 220) : "",
          contestada: false,
          omitida: true
        });
      } else if (
        (estadoPartida === "ABANDONADA" || estadoPartida === "EN_CURSO") &&
        i === indice
      ) {
        act.push({
          indice: i,
          ok: !!respondidaBien,
          errores: erroresOpcion,
          tiempo: tiempoSeg(),
          texto: textoPreg(),
          contestada: !!respondidaBien,
          omitida: false
        });
      }
    }
    return act;
  }

  function calcularIndiceParaGuardar(ctx) {
    var estadoPartida = ctx.estadoPartida;
    var indice = ctx.indice;
    var respondidaBien = ctx.respondidaBien;
    var partidaTerminada = ctx.partidaTerminada;
    var listaLen = ctx.listaLength;

    if (estadoPartida !== "EN_CURSO" && estadoPartida !== "ABANDONADA") {
      return indice;
    }
    if (respondidaBien && !partidaTerminada) {
      var next = indice + 1;
      return next < listaLen ? next : indice;
    }
    return indice;
  }

  window.QuizSync = {
    contarPreguntasOkActividad: contarPreguntasOkActividad,
    tiempoPromedioActividad: tiempoPromedioActividad,
    idsPreguntasLista: idsPreguntasLista,
    construirActividadParaGuardar: construirActividadParaGuardar,
    calcularIndiceParaGuardar: calcularIndiceParaGuardar
  };
})();
