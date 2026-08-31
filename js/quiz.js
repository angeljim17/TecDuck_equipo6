// Pantalla del quiz: el alumno responde preguntas, pierde vidas y gana monedas.
// Carga parámetros de la URL, valida acceso, sincroniza el avance con la nube
// y reanuda la partida si vuelves al mismo nivel. También cubre niveles del
// maestro, modo vista previa y el plano de coordenadas (JXG) en temas 1 y 2.

(function () {
  "use strict";

  var QH = window.QuizHelpers;
  var QS = window.QuizSync;
  var QU = window.QuizUi;
  var quizSearchParams = QH.quizSearchParams;
  var quizLeerParamsPartida = QH.quizLeerParamsPartida;
  var quizNormalizarTnId = QH.quizNormalizarTnId;
  var quizLimpiarTnPendiente = QH.quizLimpiarTnPendiente;
  var quizClaveNv = QH.quizClaveNv;
  var quizTemaDbIdDesdeCodigo = QH.quizTemaDbIdDesdeCodigo;
  var quizEsPartidaNivelMaestro = QH.quizEsPartidaNivelMaestro;
  var quizAvisar = QH.quizAvisar;
  var barajar = QH.barajar;
  var monedasQuizSiAhoraAcierta = QH.monedasQuizSiAhoraAcierta;

  var tnId = null;
  var nivelMaestro = null;
  var quizOptsPartida = null;
  var temaId = "1";
  var modo = "facil";
  var quizModoPreview = false;
  var nivelNv = null;

  // Extrae de la URL el tema, modo, id de nivel maestro (tn) y si es vista previa.
  function aplicarParamsPartida(conf) {
    conf = conf || quizLeerParamsPartida();
    tnId = quizNormalizarTnId(conf.tnId);
    temaId = conf.temaId;
    modo = conf.modo;
    nivelNv = tnId ? null : quizClaveNv(temaId, modo);
    quizModoPreview = !!conf.preview;
    nivelMaestro = null;
    quizOptsPartida = null;
    if (window.quizConfigPartida) {
      delete window.quizConfigPartida;
    }
  }

  function partidaEsNivelMaestro() {
    return !!tnId;
  }

  function claveNivelActualQuiz() {
    if (tnId && nivelMaestro) {
      return (
        "tn:" +
        String(nivelMaestro.dbId || nivelMaestro.id || tnId)
      );
    }
    return "nv:" + String(nivelNv || quizClaveNv(temaId, modo));
  }

  function metaActividadNivelQuiz() {
    if (tnId) {
      var idTn =
        nivelMaestro && (nivelMaestro.dbId || nivelMaestro.id)
          ? nivelMaestro.dbId || nivelMaestro.id
          : tnId;
      return { tn: String(idTn) };
    }
    return { nv: String(nivelNv || quizClaveNv(temaId, modo)) };
  }

  function empaquetarActividadQuiz(items, preguntaIds, preguntas) {
    if (typeof quizProgressEmpaquetarActividad !== "function") {
      return items;
    }
    return quizProgressEmpaquetarActividad(
      items,
      preguntaIds,
      preguntas,
      metaActividadNivelQuiz()
    );
  }

  function resetEstadoPartidaLocal() {
    lista = [];
    indice = 0;
    vidas = 3;
    partidaTerminada = false;
    respondidaBien = false;
    monedaPagada = false;
    seleccionPendienteIdx = null;
    erroresOpcionIncorrectaEstaPregunta = 0;
    reiniciarQuizSync();
  }

  function temaIdParaGuardarQuiz() {
    if (tnId) {
      return null;
    }
    if (typeof quizTemaDbIdDesdeCodigo === "function") {
      return quizTemaDbIdDesdeCodigo(temaId);
    }
    return parseInt(temaId, 10);
  }

  aplicarParamsPartida();

  // Dice si esta partida puede mostrar el mapa JXG (solo temas 1 y 2, salvo que lo desactiven).
  function partidaUsaMapaJXG() {
    var t = String(temaId);
    if (t !== "1" && t !== "2") {
      return false;
    }
    if (
      window.quizConfigPartida &&
      window.quizConfigPartida.mostrarJxg === false
    ) {
      return false;
    }
    return true;
  }

  // En básico el mapa se dibuja al elegir opción; en avanzado, solo al confirmar un acierto.
  function jxgVistaAlSeleccionarOpcion() {
    return modo === "facil";
  }

  // Actualiza el texto de ayuda del panel del mapa según el modo y la pregunta.
  function actualizarHintMapaJXG(pregunta) {
    var hint = document.querySelector(".quiz-jxg-panel-hint");
    if (!hint || !pregunta) {
      return;
    }
    if (
      !partidaUsaMapaJXG() ||
      typeof quizPreguntaUsaMapaJXG !== "function" ||
      !quizPreguntaUsaMapaJXG(temaId, pregunta)
    ) {
      return;
    }
    hint.textContent =
      pregunta.jxg && pregunta.jxg.fijo
        ? "Plano de coordenadas — observa el punto y elige la respuesta correcta"
        : modo === "dificil"
        ? "Plano de coordenadas — se dibujará al confirmar la respuesta correcta"
        : "Plano de coordenadas — elige una opción para verla dibujada";
  }

  // Vuelve a preparar el mapa para la pregunta en la que estamos.
  function reiniciarMapaPreguntaActual() {
    if (!lista[indice]) {
      return;
    }
    prepararMapaPregunta(lista[indice]);
  }

  // Comprueba que el alumno haya desbloqueado el modo avanzado del tema antes de jugar.
  async function validarAccesoTemaModo() {
    if (tnId || modo !== "dificil") {
      return true;
    }
    if (typeof quizProgressCargarDesbloqueosTemas === "function") {
      await quizProgressCargarDesbloqueosTemas();
    }
    if (
      typeof isDificilDesbloqueado === "function" &&
      !isDificilDesbloqueado(temaId)
    ) {
      quizAvisar(
        "Completa el nivel básico de este tema antes de jugar el avanzado."
      );
      irATemasQuiz();
      return false;
    }
    return true;
  }

  // Pinta u oculta el banner de modo vista previa (no guarda progreso ni monedas).
  function pintarBannerPreview() {
    var banner = document.getElementById("quiz-preview-banner");
    if (!banner) {
      return;
    }
    if (!quizModoPreview) {
      banner.hidden = true;
      return;
    }
    banner.textContent =
      typeof str === "function"
        ? str("quiz.previewBanner", "Modo vista previa — no se guarda progreso ni monedas.")
        : "Modo vista previa — no se guarda progreso ni monedas.";
    banner.hidden = false;
    document.body.classList.add("quiz--preview");
  }

  // Valida que el nivel del maestro exista, sea del grupo del alumno y no esté vencido.
  async function validarAccesoNivelMaestro() {
    if (!tnId) {
      return true;
    }
    if (!nivelMaestro) {
      quizAvisar("Este nivel no existe o fue eliminado.");
      irATemasQuiz();
      return false;
    }
    if (quizModoPreview) {
      if (!nivelMaestroContarPreguntas(nivelMaestro)) {
        quizAvisar("Este nivel aún no tiene preguntas.");
        return false;
      }
      return true;
    }
    var vinculo =
      typeof alumnoObtenerGrupoVinculadoAsync === "function"
        ? await alumnoObtenerGrupoVinculadoAsync()
        : null;
    if (!vinculo || !vinculo.grupoId) {
      quizAvisar("Este nivel no está disponible para tu grupo.");
      irATemasQuiz();
      return false;
    }
    if (!nivelMaestroVisibleParaGrupo(nivelMaestro, vinculo.grupoId)) {
      quizAvisar("Este nivel no está disponible para tu grupo.");
      irATemasQuiz();
      return false;
    }
    if (
      typeof nivelMaestroFechaVencida === "function" &&
      nivelMaestroFechaVencida(nivelMaestro, vinculo.grupoId)
    ) {
      quizAvisar("La fecha límite de este nivel ya pasó. Ya no puedes jugarlo.");
      irATemasQuiz();
      return false;
    }
    if (!nivelMaestroContarPreguntas(nivelMaestro)) {
      quizAvisar("Este nivel aún no tiene preguntas. Avísale a tu maestro.");
      irATemasQuiz();
      return false;
    }
    return true;
  }

  var lista = [];
  var indice = 0;
  var vidas = 3;
  var partidaTerminada = false;
  var _finNivelIniciado = false;
  var DELAY_CELEBRACION_MS = 380;
  var respondidaBien = false;
  var monedaPagada = false;
  /* Guardamos los datos de las opciones de la pregunta actual para no depender
     de leer atributos del DOM al renderizar la retroalimentación. */
  var opcionesActuales = [];
  /** Incorrectas dadas ya en esta pregunta antes del primer acierto (se reinicia cada pregunta). */
  var erroresOpcionIncorrectaEstaPregunta = 0;
  /** Índice de opción elegida pendiente de confirmar (null = ninguna). */
  var seleccionPendienteIdx = null;
  var _quizSync = {
    porIndice: {},
    preguntasOk: 0,
    monedasGanadas: 0,
    monedasServidor: 0,
    lastSaveParams: null,
    preguntaInicioMs: Date.now(),
    finalizado: false,
    pausado: false
  };

  // Resetea el estado interno que usamos para sincronizar la partida con el servidor.
  function reiniciarQuizSync() {
    _quizSync = {
      porIndice: {},
      preguntasOk: 0,
      monedasGanadas: 0,
      monedasServidor: 0,
      lastSaveParams: null,
      preguntaInicioMs: Date.now(),
      finalizado: false,
      pausado: false
    };
  }

  // Cuántos segundos lleva el alumno en la pregunta actual (mínimo 1).
  function tiempoSegundosPreguntaActual() {
    return Math.max(
      1,
      Math.round((Date.now() - (_quizSync.preguntaInicioMs || Date.now())) / 1000)
    );
  }

  // Texto corto de la pregunta actual, para guardarlo en la actividad.
  function textoPreguntaActual() {
    var p = lista[indice];
    return p ? String(p.q || "").slice(0, 220) : "";
  }

  // Registra un fallo en la pregunta actual sin marcarla como contestada correctamente.
  function registrarErrorPreguntaActual() {
    var prev = _quizSync.porIndice[indice];
    _quizSync.porIndice[indice] = {
      indice: indice,
      ok: false,
      errores: erroresOpcionIncorrectaEstaPregunta,
      tiempo: prev ? prev.tiempo : tiempoSegundosPreguntaActual(),
      texto: textoPreguntaActual(),
      contestada: false,
      omitida: false
    };
  }

  // Anota en sync que la pregunta se contestó (bien o mal) con tiempo y errores.
  function registrarActividadPregunta(ok, texto) {
    _quizSync.porIndice[indice] = {
      indice: indice,
      ok: !!ok,
      errores: erroresOpcionIncorrectaEstaPregunta,
      tiempo: tiempoSegundosPreguntaActual(),
      texto: String(texto || "").slice(0, 220),
      contestada: true,
      omitida: false
    };
    if (ok) {
      _quizSync.preguntasOk += 1;
    }
  }

  function syncCtxActividad(estadoPartida) {
    return {
      lista: lista,
      indice: indice,
      porIndice: _quizSync.porIndice,
      estadoPartida: estadoPartida,
      respondidaBien: respondidaBien,
      erroresOpcionIncorrectaEstaPregunta: erroresOpcionIncorrectaEstaPregunta,
      tiempoSegundosPreguntaActual: tiempoSegundosPreguntaActual,
      textoPreguntaActual: textoPreguntaActual
    };
  }

  function construirActividadParaGuardar(estadoPartida) {
    return QS.construirActividadParaGuardar(syncCtxActividad(estadoPartida));
  }

  function contarPreguntasOkActividad(act) {
    return QS.contarPreguntasOkActividad(act);
  }

  function tiempoPromedioActividad(act) {
    return QS.tiempoPromedioActividad(act);
  }

  function idsPreguntasLista(arr) {
    return QS.idsPreguntasLista(arr);
  }

  function calcularIndiceParaGuardar(estadoPartida) {
    return QS.calcularIndiceParaGuardar({
      estadoPartida: estadoPartida,
      indice: indice,
      respondidaBien: respondidaBien,
      partidaTerminada: partidaTerminada,
      listaLength: lista.length
    });
  }

  // Envío ligero al cerrar pestaña o navegar (keepalive), sin bloquear la salida.
  function enviarResultadoQuizKeepalive(estadoPartida) {
    if (
      quizModoPreview ||
      typeof quizProgressConstruirParamsGuardar !== "function" ||
      typeof quizProgressEnvioKeepalive !== "function" ||
      !lista.length
    ) {
      return false;
    }
    var actividadItems = construirActividadParaGuardar(estadoPartida);
    if (!actividadItems.length && estadoPartida !== "EN_CURSO") {
      return false;
    }
    var preguntaIds = idsPreguntasLista(lista);
    var preguntasSnapshot = lista.map(function (p) {
      return { id: p.id, texto: String(p.q || "").slice(0, 220) };
    });
    var actividadPayload = empaquetarActividadQuiz(
      actividadItems,
      preguntaIds,
      preguntasSnapshot
    );
    var params = quizProgressConstruirParamsGuardar({
      temaId: temaIdParaGuardarQuiz(),
      nivelMaestroId:
        tnId && nivelMaestro
          ? nivelMaestro.dbId || parseInt(nivelMaestro.id, 10) || null
          : null,
      modo: modo,
      estado: estadoPartida,
      preguntasOk: contarPreguntasOkActividad(actividadItems),
      preguntasTotal: lista.length,
      tiempoPromedioSeg: tiempoPromedioActividad(actividadItems),
      monedasGanadas: _quizSync.monedasGanadas,
      vidasRestantes: vidas,
      indicePregunta: calcularIndiceParaGuardar(estadoPartida),
      actividad: actividadPayload
    });
    return quizProgressEnvioKeepalive(params);
  }

  // Guarda el resultado de la partida en Supabase (completada, game over, pausa, etc.).
  async function enviarResultadoQuiz(estadoPartida) {
    if (quizModoPreview) {
      return true;
    }
    if (typeof quizProgressGuardar !== "function") {
      return false;
    }
    if (tnId && !nivelMaestro) {
      return false;
    }
    var esFinal =
      estadoPartida === "COMPLETADA" || estadoPartida === "GAME_OVER";
    var esPausa =
      estadoPartida === "ABANDONADA" || estadoPartida === "EN_CURSO";
    if (_quizSync.finalizado && esFinal) {
      return false;
    }
    if (_quizSync.pausado && esPausa) {
      return true;
    }
    if (!lista.length) {
      return false;
    }

    var actividadItems = construirActividadParaGuardar(estadoPartida);
    if (!actividadItems.length && !esPausa) {
      return false;
    }

    var preguntaIds = idsPreguntasLista(lista);
    var preguntasSnapshot = lista.map(function (p) {
      return {
        id: p.id,
        texto: String(p.q || "").slice(0, 220)
      };
    });
    var actividadPayload = empaquetarActividadQuiz(
      actividadItems,
      preguntaIds,
      preguntasSnapshot
    );

    try {
      var payload = {
        temaId: temaIdParaGuardarQuiz(),
        nivelMaestroId:
          tnId && nivelMaestro
            ? nivelMaestro.dbId || parseInt(nivelMaestro.id, 10) || null
            : null,
        modo: modo,
        estado: estadoPartida,
        preguntasOk: contarPreguntasOkActividad(actividadItems),
        preguntasTotal: lista.length,
        tiempoPromedioSeg: tiempoPromedioActividad(actividadItems),
        monedasGanadas: _quizSync.monedasGanadas,
        vidasRestantes: vidas,
        indicePregunta: calcularIndiceParaGuardar(estadoPartida),
        actividad: actividadPayload
      };
      if (typeof quizProgressConstruirParamsGuardar === "function") {
        _quizSync.lastSaveParams = quizProgressConstruirParamsGuardar(payload);
      }
      var res = await quizProgressGuardar(payload);
      if (!res || !res.ok) {
        console.warn("[quiz] sync:", res && res.error ? res.error : "Error desconocido");
        return false;
      }
      if (res.monedasPartida != null) {
        _quizSync.monedasGanadas = res.monedasPartida;
        _quizSync.monedasServidor = res.monedasPartida;
      }
      if (esFinal) {
        _quizSync.finalizado = true;
      }
      if (esPausa) {
        _quizSync.pausado = true;
      }
      return true;
    } catch (e) {
      console.warn("[quiz] sync:", e);
      return false;
    }
  }

  // Estado con el que guardamos al salir: sigue en curso si quedan vidas, si no abandonada.
  function estadoSalidaConVidas() {
    return vidas > 0 ? "EN_CURSO" : "ABANDONADA";
  }

  // Restaura vidas, índice, monedas y actividad desde lo que vino de la base de datos.
  function aplicarEstadoPartidaDesdeDb(partida, itemsActividad) {
    var idx = Math.max(0, parseInt(partida.indice_pregunta, 10) || 0);
    if (idx >= lista.length) {
      idx = Math.max(0, lista.length - 1);
    }
    indice = idx;
    vidas = Math.min(3, Math.max(0, parseInt(partida.vidas_restantes, 10) || 0));
    partidaTerminada = false;
    respondidaBien = false;
    monedaPagada = false;
    reiniciarQuizSync();
    _quizSync.monedasGanadas = parseInt(partida.monedas_ganadas, 10) || 0;
    _quizSync.monedasServidor = _quizSync.monedasGanadas;
    var i;
    for (i = 0; i < itemsActividad.length; i++) {
      var it = itemsActividad[i];
      if (!it || it.indice == null) {
        continue;
      }
      _quizSync.porIndice[it.indice] = {
        indice: it.indice,
        ok: !!it.ok,
        errores: it.errores || 0,
        tiempo: it.tiempo || 0,
        texto: it.texto || "",
        contestada: it.contestada !== false,
        omitida: !!it.omitida
      };
      if (it.ok) {
        _quizSync.preguntasOk += 1;
      }
    }
  }

  // Si hay partida EN_CURSO en la nube para este mismo nivel, la restaura en silencio.
  async function intentarReanudarPartidaDesdeDb() {
    if (
      quizModoPreview ||
      typeof quizProgressCargarPartidaActiva !== "function"
    ) {
      return false;
    }
    var nivelDbId =
      tnId && nivelMaestro
        ? nivelMaestro.dbId || parseInt(nivelMaestro.id, 10) || null
        : null;
    var res = await quizProgressCargarPartidaActiva({
      temaId: tnId ? null : parseInt(temaId, 10),
      modo: modo,
      nivelMaestroId: nivelDbId
    });
    if (!res || !res.ok || !res.partida) {
      return false;
    }

    var parsed =
      typeof quizProgressParsearActividad === "function"
        ? quizProgressParsearActividad(res.partida.actividad)
        : { items: [], preguntaIds: [] };
    if (!parsed.preguntaIds.length && parsed.preguntas && parsed.preguntas.length) {
      parsed.preguntaIds = parsed.preguntas
        .map(function (p) {
          return p && p.id;
        })
        .filter(Boolean);
    }
    if (!parsed.preguntaIds.length) {
      return false;
    }

    var restaurada = null;
    if (
      nivelMaestro &&
      typeof nivelMaestroObtenerPreguntasPartida === "function"
    ) {
      var todas = nivelMaestroObtenerPreguntasPartida(nivelMaestro);
      restaurada =
        typeof quizFiltrarPreguntasPorIds === "function"
          ? quizFiltrarPreguntasPorIds(todas, parsed.preguntaIds)
          : null;
    } else if (typeof quizPreguntasPorIds === "function") {
      restaurada = quizPreguntasPorIds(temaId, modo, parsed.preguntaIds);
    }

    if (!restaurada || !restaurada.length) {
      return false;
    }

    lista = restaurada;
    if (typeof quizRestaurarColaDesdePartida === "function") {
      quizRestaurarColaDesdePartida(temaId, modo, parsed.preguntaIds, {
        nivelMaestroId: nivelDbId
      });
    }
    if (
      parseInt(res.partida.indice_pregunta, 10) >= lista.length &&
      contarPreguntasOkActividad(parsed.items) >= lista.length
    ) {
      aplicarEstadoPartidaDesdeDb(res.partida, parsed.items);
      indice = lista.length - 1;
      partidaTerminada = false;
      await terminarQuiz();
      return true;
    }
    aplicarEstadoPartidaDesdeDb(res.partida, parsed.items);
    pintarContextoQuiz();
    pintarVidas();
    mostrarPregunta();
    pintarSaldo();
    registrarClaveNivelQuizEnSesion();
    return true;
  }

  function registrarClaveNivelQuizEnSesion() {
    try {
      sessionStorage.setItem("tec_duck_quiz_nivel", claveNivelActualQuiz());
    } catch (e) {
      /* noop */
    }
  }

  // Guarda el avance y redirige; si falla el guardado, se queda en la pantalla.
  async function guardarProgresoYSalir(destino) {
    if (!hayProgresoEnPartida()) {
      if (destino) {
        window.location.href = destino;
      }
      return true;
    }
    var ok = await enviarResultadoQuiz(estadoSalidaConVidas());
    if (!ok) {
      quizAvisar(
        "No se pudo guardar tu avance en la nube. Revisa tu conexión e inténtalo de nuevo."
      );
      return false;
    }
    if (destino) {
      if (
        typeof pageLoadDestinoEsTemas === "function" &&
        pageLoadDestinoEsTemas(destino) &&
        typeof pageLoadIrATemas === "function"
      ) {
        pageLoadIrATemas();
        return true;
      }
      window.location.href = destino;
    }
    return true;
  }

  // Navega de vuelta a la pantalla de temas.
  function irATemasQuiz() {
    if (typeof pageLoadIrATemas === "function") {
      pageLoadIrATemas();
      return;
    }
    window.location.href =
      typeof pagina === "function" ? pagina("topics.html") : "topics.html";
  }

  // True si ya hubo movimiento en la partida (preguntas, vidas, errores o monedas).
  function hayProgresoEnPartida() {
    if (partidaTerminada || !lista.length) {
      return false;
    }
    if (indice > 0) {
      return true;
    }
    if (vidas < 3) {
      return true;
    }
    if (erroresOpcionIncorrectaEstaPregunta > 0) {
      return true;
    }
    if (monedaPagada || respondidaBien) {
      return true;
    }
    return false;
  }

  // Diálogo de confirmación al volver a temas guardando el avance.
  function quizStrModal(key, fallback) {
    return typeof str === "function" ? str("quiz." + key, fallback) : fallback;
  }

  async function confirmarSalirTemas() {
    if (typeof QU.quizConfirmarModal === "function") {
      return QU.quizConfirmarModal({
        titulo: quizStrModal("modalSalirTitulo", "¿Volver a temas?"),
        cuerpo: quizStrModal(
          "modalSalirCuerpo",
          "Se guardará tu avance (pregunta actual, vidas y errores) en la nube."
        ),
        confirmarTexto: quizStrModal("modalSalirConfirmar", "Volver a temas")
      });
    }
    return window.confirm(
      "Se guardará tu avance en la nube (pregunta actual, vidas y errores).\n\n¿Volver a temas?"
    );
  }

  // Diálogo de confirmación al reiniciar el nivel desde cero.
  async function confirmarReiniciarNivel() {
    if (typeof QU.quizConfirmarModal === "function") {
      return QU.quizConfirmarModal({
        titulo: quizStrModal("modalReiniciarTitulo", "¿Reiniciar nivel?"),
        cuerpo: quizStrModal(
          "modalReiniciarCuerpo",
          "Este intento se marcará como abandonado y empezarás desde cero."
        ),
        confirmarTexto: quizStrModal("modalReiniciarConfirmar", "Reiniciar"),
        variant: "danger"
      });
    }
    return window.confirm(
      "Se guardará este intento como abandonado y empezarás el nivel desde cero.\n\n¿Reiniciar el nivel?"
    );
  }

  function urlSiguienteNivelTrasCompletar() {
    if (partidaEsNivelMaestro() || quizModoPreview || modo !== "facil") {
      return null;
    }
    if (
      typeof isDificilDesbloqueado !== "function" ||
      !isDificilDesbloqueado(temaId)
    ) {
      return null;
    }
    return typeof paginaQuiz === "function"
      ? paginaQuiz(temaId, "dificil")
      : "/pages/quiz?tema=" +
          encodeURIComponent(temaId) +
          "&modo=dificil";
  }

  function reintentarTrasGameOver() {
    if (typeof QU.ocultarGameOverPanel === "function") {
      QU.ocultarGameOverPanel();
    }
    reiniciarNivelQuizNuevaPartida();
  }

  // Si reanudó la partida, recupera cuántas veces ya falló en esta pregunta (para monedas y UI).
  function restaurarErroresPreguntaActualDesdeSync() {
    var entry = _quizSync.porIndice[indice];
    if (
      entry &&
      !entry.ok &&
      entry.contestada === false &&
      (Number(entry.errores) || 0) > 0
    ) {
      erroresOpcionIncorrectaEstaPregunta = Number(entry.errores) || 0;
      return;
    }
    erroresOpcionIncorrectaEstaPregunta = 0;
  }

  function pintarVidas() {
    QU.pintarVidas(vidas);
  }

  function pintarProgreso() {
    QU.pintarProgreso(indice, lista.length);
  }

  function pintarSaldo(extra) {
    extra = extra || {};
    QU.pintarSaldo({
      saldoBase: duckObtenerSaldoMonedas(),
      monedasGanadas: _quizSync.monedasGanadas,
      monedasServidor: _quizSync.monedasServidor,
      respondidaBien: respondidaBien,
      partidaTerminada: partidaTerminada,
      listaLength: lista.length,
      erroresOpcion: erroresOpcionIncorrectaEstaPregunta,
      monedasSiAcierta: monedasQuizSiAhoraAcierta,
      quizModoPreview: quizModoPreview,
      animarMonedas: !!extra.animarMonedas,
      monedasRecienGanadas: extra.monedasRecienGanadas || 0
    });
  }

  function deshabilitarOpciones() {
    QU.deshabilitarOpciones();
  }

  function habilitarOpciones() {
    QU.habilitarOpciones();
  }

  function limpiarClasesOpciones() {
    QU.limpiarClasesOpciones();
  }

  function ocultarConfirmar() {
    QU.ocultarConfirmar(function () {
      seleccionPendienteIdx = null;
    });
  }

  function mostrarConfirmar() {
    QU.mostrarConfirmar(
      seleccionPendienteIdx !== null && !respondidaBien && !partidaTerminada
    );
  }

  // Si la pregunta actual lleva mapa JXG para este tema.
  function preguntaUsaMapaJXG(pregunta) {
    return (
      partidaUsaMapaJXG() &&
      typeof quizPreguntaUsaMapaJXG === "function" &&
      !!quizPreguntaUsaMapaJXG(temaId, pregunta)
    );
  }

  // Ajusta clases del body para layout con o sin panel del mapa.
  function aplicarLayoutMapaQuiz(pregunta) {
    var conMapa = !!pregunta && preguntaUsaMapaJXG(pregunta);
    document.body.classList.toggle("quiz--con-mapa", conMapa);
    document.body.classList.toggle("quiz--sin-mapa", !conMapa);
  }

  // Prepara u oculta el mapa JXG según la pregunta y actualiza el hint.
  function prepararMapaPregunta(pregunta) {
    aplicarLayoutMapaQuiz(pregunta);
    if (typeof QuizJXGMapaFijo === "undefined") {
      return;
    }
    if (partidaUsaMapaJXG()) {
      QuizJXGMapaFijo.prepararPregunta(temaId, pregunta);
      actualizarHintMapaJXG(pregunta);
    } else {
      QuizJXGMapaFijo.ocultar();
    }
  }

  // Dibuja en el mapa la vista asociada a una opción elegida.
  function vistaMapaOpcion(opcion) {
    if (
      !partidaUsaMapaJXG() ||
      typeof QuizJXGMapaFijo === "undefined" ||
      !lista[indice]
    ) {
      return;
    }
    QuizJXGMapaFijo.vistaOpcion(temaId, lista[indice], opcion);
  }

  function ocultarFeedback() {
    QU.ocultarFeedback();
  }

  function ocultarSiguiente() {
    QU.ocultarSiguiente();
  }

  function mostrarSiguiente(texto, onClick) {
    QU.mostrarSiguiente(texto, onClick);
  }

  function mostrarFeedback(texto) {
    QU.mostrarFeedback(texto);
  }

  // Pantalla de sin vidas: guarda game over y ofrece salir a temas.
  async function mostrarGameOver() {
    partidaTerminada = true;
    deshabilitarOpciones();
    ocultarConfirmar();
    ocultarFeedback();
    if (typeof QuizJXGMapaFijo !== "undefined") {
      QuizJXGMapaFijo.ocultar();
    }
    ocultarSiguiente();
    if (typeof QU.mostrarGameOverPanel === "function") {
      QU.mostrarGameOverPanel({
        onReintentar: reintentarTrasGameOver
      });
    } else {
      var go = document.getElementById("quiz-gameover");
      if (go) {
        go.textContent =
          "Sin vidas. Vuelve a intentarlo desde Temas cuando quieras.";
        go.hidden = false;
      }
    }
    var guardado = await enviarResultadoQuiz("GAME_OVER");
    if (!guardado) {
      quizAvisar(
        "Sin vidas, pero no se pudo guardar el resultado. Revisa tu conexión."
      );
    }
    pintarSaldo();
  }

  // Fin feliz: guarda completada y muestra celebración.
  async function terminarQuiz(opciones) {
    opciones = opciones || {};
    var guardado = await enviarResultadoQuiz("COMPLETADA");
    var actividadItems = construirActividadParaGuardar("COMPLETADA");
    var aciertos = contarPreguntasOkActividad(actividadItems);
    var monedasPartida = _quizSync.monedasGanadas || 0;

    if (opciones.celebracion && typeof QU.actualizarCelebracionNivel === "function") {
      if (!guardado) {
        QU.actualizarCelebracionNivel({
          error: true,
          onReintentar: function () {
            terminarQuiz({ celebracion: true });
          }
        });
      } else {
        QU.actualizarCelebracionNivel({
          aciertos: aciertos,
          total: lista.length,
          monedas: monedasPartida,
          preview: quizModoPreview,
          siguienteNivelUrl: urlSiguienteNivelTrasCompletar()
        });
      }
      partidaTerminada = true;
      pintarSaldo();
      return;
    }

    if (!guardado) {
      document.getElementById("quiz-question-text").textContent =
        "Completaste el quiz, pero no se pudo guardar el progreso en la nube. Revisa tu conexión e inténtalo de nuevo.";
      mostrarSiguiente("Reintentar guardar", function () {
        terminarQuiz();
      });
      partidaTerminada = true;
      pintarSaldo();
      return;
    }
    ocultarSiguiente();
    if (typeof QU.mostrarCelebracionNivel === "function") {
      QU.mostrarCelebracionNivel({ preview: quizModoPreview });
      QU.actualizarCelebracionNivel({
        aciertos: aciertos,
        total: lista.length,
        monedas: monedasPartida,
        preview: quizModoPreview,
        siguienteNivelUrl: urlSiguienteNivelTrasCompletar()
      });
    } else {
      document.getElementById("quiz-question-text").textContent =
        "¡Completaste el quiz! Monedas y progreso guardados.";
      document.getElementById("quiz-options").innerHTML = "";
    }
    if (typeof QuizJXGMapaFijo !== "undefined") {
      QuizJXGMapaFijo.ocultar();
    }
    ocultarConfirmar();
    ocultarFeedback();
    partidaTerminada = true;
    pintarSaldo();
  }

  function iniciarFinNivel() {
    if (_finNivelIniciado || partidaTerminada) {
      return;
    }
    _finNivelIniciado = true;
    setTimeout(function () {
      var prog = document.getElementById("quiz-progress");
      if (prog && lista.length) {
        prog.textContent = lista.length + " / " + lista.length + " ✓";
      }
      if (typeof QU.mostrarCelebracionNivel === "function") {
        QU.mostrarCelebracionNivel({ preview: quizModoPreview });
      } else if (typeof QU.ocultarAreaPreguntaQuiz === "function") {
        QU.ocultarAreaPreguntaQuiz();
      }
      terminarQuiz({ celebracion: true });
    }, DELAY_CELEBRACION_MS);
  }

  // Click en una opción: la marca como elegida y muestra confirmar (y el mapa en básico).
  function seleccionarOpcion(ev) {
    if (partidaTerminada) return;
    if (respondidaBien) return;

    ocultarSiguiente();

    var btn = ev.currentTarget;
    if (btn.disabled) return;

    var idx = parseInt(btn.getAttribute("data-idx"), 10);
    var opt = opcionesActuales[idx];
    if (!opt) return;

    var opts = document.querySelectorAll("#quiz-options .option");
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.remove("option-elegida");
      opts[i].setAttribute("aria-pressed", "false");
    }
    btn.classList.add("option-elegida");
    btn.setAttribute("aria-pressed", "true");
    seleccionPendienteIdx = idx;
    if (jxgVistaAlSeleccionarOpcion()) {
      vistaMapaOpcion(opt);
    } else {
      reiniciarMapaPreguntaActual();
    }
    mostrarConfirmar();
  }

  // Valida la opción elegida: suma monedas si acierta, resta vida si falla.
  function confirmarRespuesta() {
    if (partidaTerminada) return;
    if (respondidaBien) return;
    if (seleccionPendienteIdx === null) return;

    var idx = seleccionPendienteIdx;
    var opt = opcionesActuales[idx];
    if (!opt) return;

    var btn = document.querySelector(
      '#quiz-options .option[data-idx="' + idx + '"]'
    );
    if (!btn || btn.disabled) return;

    ocultarConfirmar();

    if (opt.ok) {
      if (!jxgVistaAlSeleccionarOpcion()) {
        vistaMapaOpcion(opt);
      }
      btn.classList.add("correct");
      respondidaBien = true;
      deshabilitarOpciones();
      ocultarFeedback();
      var monedasEstaPregunta = 0;
      if (!monedaPagada && !quizModoPreview) {
        monedaPagada = true;
        monedasEstaPregunta = monedasQuizSiAhoraAcierta(
          erroresOpcionIncorrectaEstaPregunta
        );
        _quizSync.monedasGanadas += monedasEstaPregunta;
      } else if (!monedaPagada && quizModoPreview) {
        monedaPagada = true;
      }
      registrarActividadPregunta(true, lista[indice] && lista[indice].q);
      if (indice + 1 >= lista.length) {
        iniciarFinNivel();
      } else {
        mostrarSiguiente("Siguiente pregunta", onSiguiente);
      }
      pintarSaldo({
        animarMonedas: monedasEstaPregunta > 0,
        monedasRecienGanadas: monedasEstaPregunta
      });
      if (monedasEstaPregunta > 0 && typeof QU.animarMonedasGanadas === "function") {
        QU.animarMonedasGanadas(monedasEstaPregunta, btn);
      }
      return;
    }

    ocultarSiguiente();
    btn.classList.add("wrong");
    erroresOpcionIncorrectaEstaPregunta += 1;
    registrarErrorPreguntaActual();
    vidas -= 1;
    pintarVidas();

    if (opt.fb) {
      mostrarFeedback(opt.fb);
    } else {
      ocultarFeedback();
    }

    if (vidas <= 0) {
      deshabilitarOpciones();
      mostrarGameOver();
      return;
    }

    pintarSaldo();

    /* Deshabilitamos solo esta opción para que el usuario pueda releer la
       retroalimentación y elegir otra sin volver a sumar el mismo error. */
    btn.disabled = true;
    btn.classList.remove("option-elegida");
  }

  // Avanza a la siguiente pregunta o dispara terminarQuiz si era la última.
  function onSiguiente() {
    indice += 1;
    if (indice >= lista.length) {
      terminarQuiz();
      return;
    }
    respondidaBien = false;
    monedaPagada = false;
    ocultarConfirmar();
    ocultarSiguiente();
    mostrarPregunta();
  }

  // Renderiza la pregunta actual: texto, opciones barajadas, mapa y contadores.
  function mostrarPregunta() {
    var p = lista[indice];
    _quizSync.preguntaInicioMs = Date.now();
    restaurarErroresPreguntaActualDesdeSync();
    ocultarConfirmar();
    var qEl = document.getElementById("quiz-question-text");
    if (qEl) {
      qEl.hidden = false;
      qEl.textContent = p.q;
    }
    pintarProgreso();
    pintarSaldo();
    ocultarFeedback();

    prepararMapaPregunta(p);

    opcionesActuales = barajar(p.opts);

    var cont = document.getElementById("quiz-options");
    cont.hidden = false;
    cont.innerHTML = "";
    cont.setAttribute("role", "group");
    cont.setAttribute("aria-label", "Opciones de respuesta");
    for (var i = 0; i < opcionesActuales.length; i++) {
      (function (idx, opcionDat) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "option";
        b.textContent = opcionDat.t;
        b.setAttribute("data-idx", String(idx));
        b.setAttribute("aria-pressed", "false");
        cont.appendChild(b);

        b.addEventListener("click", seleccionarOpcion);
      })(i, opcionesActuales[i]);
    }

    var go = document.getElementById("quiz-gameover");
    if (go) go.hidden = true;
    ocultarSiguiente();
    ocultarCargandoTecduckAventura();
  }

  // Título del contexto: nombre del nivel maestro o tema + modo.
  function pintarContextoQuiz() {
    var ctx = document.getElementById("quiz-context");
    if (!ctx) {
      return;
    }
    if (nivelMaestro) {
      ctx.textContent = nivelMaestro.titulo;
      return;
    }
    ctx.textContent =
      "Tema " +
      temaId +
      " · " +
      (modo === "dificil" ? "Avanzado" : "Básico");
  }

  function mostrarCargandoTecduckAventura() {
    QU.mostrarCargandoQuiz();
  }

  function ocultarCargandoTecduckAventura() {
    QU.ocultarCargandoQuiz();
  }

  // Al volver desde caché del navegador (bfcache), relee la URL y recarga la partida.
  async function reiniciarPartidaSegunUrl() {
    mostrarCargandoTecduckAventura();
    aplicarParamsPartida();
    _quizSync.pausado = false;
    _quizSync.finalizado = false;
    if (tnId && typeof nivelMaestroPorIdAsync === "function") {
      nivelMaestro = await nivelMaestroPorIdAsync(tnId, true);
      if (nivelMaestro) {
        temaId = "1";
        modo = "facil";
        quizOptsPartida = { nivelMaestroCustom: true };
        window.quizConfigPartida = {
          mostrarJxg: false,
          titulo: nivelMaestro.titulo
        };
      }
    }
    if (tnId && !(await validarAccesoNivelMaestro())) {
      return;
    }
    pintarContextoQuiz();
    await cargarOReanudarPartida();
  }

  // Enlaza el botón reiniciar: abandona en nube si había avance y empieza de cero.
  function registrarBotonReiniciarQuiz() {
    var b = document.getElementById("quiz-reiniciar");
    if (!b || b.getAttribute("data-hook") === "1") return;
    b.setAttribute("data-hook", "1");
    b.addEventListener("click", function () {
      if (!hayProgresoEnPartida()) {
        reiniciarNivelQuizNuevaPartida();
        return;
      }
      confirmarReiniciarNivel().then(function (ok) {
        if (!ok) {
          return;
        }
        enviarResultadoQuiz("ABANDONADA").then(function (saved) {
          if (!saved) {
            quizAvisar(
              "No se pudo guardar el intento abandonado. Revisa tu conexión e inténtalo de nuevo."
            );
            return;
          }
          _quizSync.pausado = false;
          reiniciarNivelQuizNuevaPartida();
        });
      });
    });
  }

  // Enlaza «volver a temas»: guarda avance si hace falta antes de salir.
  function registrarVolverTemasQuiz() {
    var link = document.getElementById("quiz-volver-temas");
    if (!link || link.getAttribute("data-hook") === "1") {
      return;
    }
    link.setAttribute("data-hook", "1");
    link.addEventListener("click", function (ev) {
      if (!hayProgresoEnPartida()) {
        ev.preventDefault();
        irATemasQuiz();
        return;
      }
      ev.preventDefault();
      confirmarSalirTemas().then(function (ok) {
        if (!ok) {
          return;
        }
        var destino =
          link.getAttribute("href") ||
          (typeof pagina === "function" ? pagina("topics.html") : "topics.html");
        guardarProgresoYSalir(destino).then(function (saved) {
          if (!saved) {
            return;
          }
        });
      });
    });
  }

  // Enlaza el botón confirmar respuesta (una sola vez).
  function registrarBotonConfirmarQuiz() {
    var b = document.getElementById("quiz-confirmar");
    if (!b || b.getAttribute("data-hook") === "1") return;
    b.setAttribute("data-hook", "1");
    b.addEventListener("click", confirmarRespuesta);
  }

  // Carga preguntas; reanuda si hay partida EN_CURSO, si no empieza de cero.
  async function cargarOReanudarPartida() {
    ocultarFeedback();
    var go = document.getElementById("quiz-gameover");
    if (go) {
      go.hidden = true;
    }
    ocultarSiguiente();
    _quizSync.pausado = false;
    _quizSync.finalizado = false;

    if (await intentarReanudarPartidaDesdeDb()) {
      ocultarCargandoTecduckAventura();
      return;
    }
    reiniciarNivelQuizNuevaPartida();
  }

  // Carga preguntas frescas y resetea vidas, índice y sync para una partida nueva.
  function reiniciarNivelQuizNuevaPartida() {
    _finNivelIniciado = false;
    if (typeof QU.ocultarCelebracionNivel === "function") {
      QU.ocultarCelebracionNivel();
    }
    if (typeof QU.ocultarGameOverPanel === "function") {
      QU.ocultarGameOverPanel();
    }
    ocultarFeedback();
    var go = document.getElementById("quiz-gameover");
    if (go) {
      go.hidden = true;
    }
    ocultarSiguiente();

    if (
      nivelMaestro &&
      typeof nivelMaestroObtenerPreguntasPartida === "function"
    ) {
      lista = nivelMaestroObtenerPreguntasPartida(nivelMaestro);
    } else {
      lista = quizObtenerPreguntas(temaId, modo, quizOptsPartida);
    }
    if (!lista.length) {
      document.getElementById("quiz-question-text").textContent =
        nivelMaestro
          ? "Este nivel no tiene preguntas todavía."
          : "No hay preguntas para este tema.";
      document.getElementById("quiz-options").innerHTML = "";
      if (typeof QuizJXGMapaFijo !== "undefined") {
        QuizJXGMapaFijo.ocultar();
      }
      aplicarLayoutMapaQuiz(null);
      ocultarConfirmar();
      var prog = document.getElementById("quiz-progress");
      if (prog) prog.textContent = "—";
      indice = 0;
      vidas = 3;
      partidaTerminada = false;
      respondidaBien = false;
      monedaPagada = false;
      reiniciarQuizSync();
      pintarContextoQuiz();
      pintarVidas();
      pintarSaldo();
      ocultarCargandoTecduckAventura();
      return;
    }

    reiniciarQuizSync();
    indice = 0;
    vidas = 3;
    partidaTerminada = false;
    respondidaBien = false;
    monedaPagada = false;
    pintarContextoQuiz();
    pintarVidas();
    mostrarPregunta();
    pintarSaldo();
    registrarClaveNivelQuizEnSesion();
  }

  // Atajos: 1-4 eligen opción, flechas rotan, Enter confirma.
  function registrarAtajosTecladoQuiz() {
    if (document.body.getAttribute("data-quiz-keys") === "1") {
      return;
    }
    document.body.setAttribute("data-quiz-keys", "1");
    document.addEventListener("keydown", function (ev) {
      if (partidaTerminada || respondidaBien) {
        return;
      }
      var tag = ev.target && ev.target.tagName ? ev.target.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea" || tag === "select") {
        return;
      }
      var key = ev.key;
      if (key === "Enter") {
        var btnConf = document.getElementById("quiz-confirmar");
        if (btnConf && !btnConf.hidden && seleccionPendienteIdx !== null) {
          ev.preventDefault();
          confirmarRespuesta();
        }
        return;
      }
      var mapa = { "1": 0, "2": 1, "3": 2, "4": 3 };
      var idx = mapa[key];
      if (idx == null && (key === "ArrowDown" || key === "ArrowUp")) {
        var opts = document.querySelectorAll("#quiz-options .option:not([disabled])");
        if (!opts.length) {
          return;
        }
        var actual = -1;
        for (var i = 0; i < opts.length; i++) {
          if (opts[i].classList.contains("option-elegida")) {
            actual = i;
            break;
          }
        }
        idx = key === "ArrowDown" ? (actual + 1) % opts.length : (actual <= 0 ? opts.length - 1 : actual - 1);
        opts[idx].click();
        ev.preventDefault();
        return;
      }
      if (idx == null) {
        return;
      }
      var boton = document.querySelector(
        '#quiz-options .option[data-idx="' + idx + '"]:not([disabled])'
      );
      if (boton) {
        ev.preventDefault();
        boton.click();
      }
    });
  }

  // Pinta el pato personalizado en la barra superior del quiz.
  function pintarPatoQuiz() {
    var wrap = document.querySelector(".quiz-duck-wrap");
    if (!wrap) {
      return;
    }
    if (quizModoPreview) {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    if (typeof duckOutfitRefrescarQuiz === "function") {
      duckOutfitRefrescarQuiz();
    }
  }

  // Punto de entrada: auth, validaciones, hooks de UI y arranque de la partida.
  async function iniciar() {
    mostrarCargandoTecduckAventura();
    aplicarParamsPartida();
    pintarBannerPreview();

    if (quizModoPreview) {
      if (typeof teacherExigirSesionAsync === "function") {
        var okMaestro = await teacherExigirSesionAsync();
        if (!okMaestro) {
          return;
        }
      }
    } else if (typeof alumnoGuardEsperar === "function") {
      var okAlumno = await alumnoGuardEsperar();
      if (!okAlumno) {
        return;
      }
    }

    pintarPatoQuiz();

    if (typeof initSupabase === "function") {
      await initSupabase();
    }
    if (
      !quizModoPreview &&
      typeof duckEconomiaSyncDesdeDb === "function" &&
      (typeof alumnoGuardEstaListo !== "function" || !alumnoGuardEstaListo())
    ) {
      try {
        await duckEconomiaSyncDesdeDb();
      } catch (e) {
        console.warn("[quiz] economia:", e);
      }
    }
    if (tnId && typeof nivelMaestroPorIdAsync === "function") {
      nivelMaestro = await nivelMaestroPorIdAsync(tnId, true);
      if (nivelMaestro) {
        if (typeof quizLimpiarTnPendiente === "function") {
          quizLimpiarTnPendiente();
        }
        temaId = "1";
        modo = "facil";
        quizOptsPartida = { nivelMaestroCustom: true };
        window.quizConfigPartida = {
          mostrarJxg: false,
          titulo: nivelMaestro.titulo
        };
      }
    }
    if (!(await validarAccesoNivelMaestro())) {
      return;
    }
    if (!(await validarAccesoTemaModo())) {
      return;
    }
    if (nivelMaestro && typeof window.quizPreguntaUsaMapaJXG === "function") {
      window.quizPreguntaUsaMapaJXG = function () {
        return false;
      };
    }
    registrarBotonReiniciarQuiz();
    registrarVolverTemasQuiz();
    registrarBotonConfirmarQuiz();
    registrarAtajosTecladoQuiz();
    reiniciarQuizSync();
    pintarContextoQuiz();
    await cargarOReanudarPartida();

    window.addEventListener("pagehide", function () {
      if (
        partidaTerminada ||
        _quizSync.finalizado ||
        _quizSync.pausado ||
        !hayProgresoEnPartida()
      ) {
        return;
      }
      enviarResultadoQuizKeepalive(estadoSalidaConVidas());
    });

    window.addEventListener("pageshow", function (ev) {
      if (!ev.persisted) {
        return;
      }
      reiniciarPartidaSegunUrl().catch(function (err) {
        console.warn("[quiz] reinicio bfcache:", err);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
