// Panel del maestro: tabla de alumnos, detalle por tema y grupos.
// Todo metido en un IIFE para no ensuciar el global.

(function () {
  "use strict";

  // Estado compartido: viene de teacher-dashboard-state.js o lo armamos aquí mismo
  var sesionLista =
    typeof teacherDashSesionLista !== "undefined" ? teacherDashSesionLista : false;
  var estado =
    typeof teacherDashEstado !== "undefined"
      ? teacherDashEstado
      : {
          vistaDashboard: "temas",
          grupoId: "grupo-todos",
          busqueda: "",
          expandidoId: null,
          detalleTemaId: null,
          detalleModoId: null,
          detalleNivelId: null,
          detalleIntentoId: null,
          grupoAsignarId: null,
          paginaActual: 1
        };

  if (typeof TEACHER_POR_PAGINA === "undefined") {
    var TEACHER_POR_PAGINA = 25;
  }

  // Referencias al DOM que usamos todo el rato
  var elHead = document.getElementById("teacher-table-head");
  var elBody = document.getElementById("teacher-table-body");
  var elEmpty = document.getElementById("teacher-empty");
  var elSearch = document.getElementById("teacher-search");
  var elGrupoFilter = document.getElementById("teacher-grupo-filter");
  var elGreeting = document.getElementById("teacher-greeting");
  var elPaginacion = document.getElementById("teacher-pagination");
  var modalGrupos = document.getElementById("teacher-modal-grupos");
  var modalEliminarAlumno = document.getElementById("teacher-modal-eliminar-alumno");
  var _alumnoEliminarPendiente = null;
  var elTableWrap = document.querySelector(".teacher-table-wrap");
  var UMBRAL_SCROLL_PRACTICAS = 4;
  var _tableWrapScrollBound = false;

  // --- Helpers de HTML (teacher-dashboard-html.js) ---

  var H = window.TeacherDashHtml;
  var escHtml = H.escHtml;
  function escAttr(s) {
    return escHtml(s).replace(/'/g, "&#39;");
  }
  var barraHtml = H.barraHtml;
  var htmlCeldaTemaFijo = H.htmlCeldaTemaFijo;
  var barraPorcentajeAciertosHtml = H.barraPorcentajeAciertosHtml;
  var intentoEnCurso = H.intentoEnCurso;
  var barraPracticaMaestroHtml = H.barraPracticaMaestroHtml;
  var barraNivelCompletoHtml = H.barraNivelCompletoHtml;
  var htmlBarrasIntento = H.htmlBarrasIntento;
  var formatearFechaPartida = H.formatearFechaPartida;
  var claseEstadoIntento = H.claseEstadoIntento;
  var htmlResultadoTarea = H.htmlResultadoTarea;

  // --- Filtrado y listas de alumnos ---

  function esVistaNiveles() {
    return estado.vistaDashboard === "niveles";
  }

  function columnasTabla() {
    if (esVistaNiveles()) {
      return typeof teacherColumnasNivelesMaestro === "function"
        ? teacherColumnasNivelesMaestro()
        : [];
    }
    return TEACHER_TEMAS;
  }

  function numColumnasTabla() {
    return columnasTabla().length;
  }

  // Sombra de columna alumno solo tras desplazar la tabla horizontalmente.
  function actualizarSombraColumnaAlumno() {
    if (!elTableWrap) {
      return;
    }
    elTableWrap.classList.toggle(
      "teacher-table-wrap--scrolled",
      elTableWrap.scrollLeft > 1
    );
  }

  function enlazarScrollTablaPracticas() {
    if (!elTableWrap || _tableWrapScrollBound) {
      return;
    }
    elTableWrap.addEventListener("scroll", actualizarSombraColumnaAlumno, {
      passive: true
    });
    _tableWrapScrollBound = true;
  }

  // Scroll horizontal en Mis prácticas cuando hay más de 4 niveles.
  function actualizarModoScrollTabla() {
    if (!elTableWrap) {
      elTableWrap = document.querySelector(".teacher-table-wrap");
    }
    if (!elTableWrap) {
      return;
    }
    var activo =
      esVistaNiveles() && numColumnasTabla() > UMBRAL_SCROLL_PRACTICAS;
    var expandido = !!estado.expandidoId;
    var scrollHabilitado = activo && !expandido;
    elTableWrap.classList.toggle("teacher-table-wrap--practicas-many", activo);
    elTableWrap.classList.toggle(
      "teacher-table-wrap--practicas-scroll",
      scrollHabilitado
    );
    elTableWrap.classList.toggle(
      "teacher-table-wrap--alumno-expandido",
      activo && expandido
    );
    if (scrollHabilitado) {
      enlazarScrollTablaPracticas();
      actualizarSombraColumnaAlumno();
    } else {
      elTableWrap.scrollLeft = 0;
      elTableWrap.classList.remove("teacher-table-wrap--scrolled");
    }
  }

  // Filtra por lo que escribió el maestro en el buscador (nombre o email)
  function filtrarAlumnos(lista) {
    var q = estado.busqueda.trim().toLowerCase();
    if (!q) {
      return lista;
    }
    return lista.filter(function (a) {
      return (
        a.nombre.toLowerCase().indexOf(q) >= 0 ||
        a.email.toLowerCase().indexOf(q) >= 0
      );
    });
  }

  // Alumnos del grupo actual ya filtrados por búsqueda
  function listaAlumnosFiltrada() {
    var base = esVistaNiveles()
      ? typeof teacherAlumnosNivelesEnGrupo === "function"
        ? teacherAlumnosNivelesEnGrupo(estado.grupoId)
        : []
      : teacherAlumnosEnGrupo(estado.grupoId);
    return filtrarAlumnos(base);
  }

  function limpiarSeleccionDetalle() {
    estado.detalleTemaId = null;
    estado.detalleModoId = null;
    estado.detalleNivelId = null;
    estado.detalleIntentoId = null;
  }

  function pintarTabsVista() {
    var tabs = document.querySelectorAll(".teacher-view-tab");
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      var activo = tab.getAttribute("data-vista") === estado.vistaDashboard;
      tab.classList.toggle("is-active", activo);
      tab.setAttribute("aria-selected", activo ? "true" : "false");
    }
  }

  // --- Pintar tabla (skeleton, paginación, cabecera, filas) ---

  // Placeholder gris mientras llegan los datos del servidor
  function pintarSkeletonTabla(filas) {
    if (!elBody) {
      return;
    }
    filas = filas || 6;
    elBody.innerHTML = "";
    elBody.setAttribute("aria-busy", "true");
    if (elEmpty) {
      elEmpty.hidden = true;
    }
    var cols = numColumnasTabla() + 1;
    for (var r = 0; r < filas; r++) {
      var tr = document.createElement("tr");
      tr.className = "teacher-skeleton-row";
      var html = "";
      for (var c = 0; c < cols; c++) {
        html +=
          '<td><span class="teacher-skeleton-bar" style="width:' +
          (c === 0 ? "70%" : "55%") +
          '"></span></td>';
      }
      tr.innerHTML = html;
      elBody.appendChild(tr);
    }
    if (elPaginacion) {
      elPaginacion.hidden = true;
    }
  }

  // Botones anterior/siguiente y el "Página X de Y"
  function pintarPaginacion(total) {
    if (!elPaginacion) {
      return;
    }
    var totalPaginas = Math.max(1, Math.ceil(total / TEACHER_POR_PAGINA));
    if (estado.paginaActual > totalPaginas) {
      estado.paginaActual = totalPaginas;
    }
    if (estado.paginaActual < 1) {
      estado.paginaActual = 1;
    }
    if (total <= TEACHER_POR_PAGINA) {
      elPaginacion.hidden = true;
      elPaginacion.innerHTML = "";
      return;
    }
    elPaginacion.hidden = false;
    elPaginacion.innerHTML =
      '<button type="button" class="teacher-page-btn" data-page="prev"' +
      (estado.paginaActual <= 1 ? " disabled" : "") +
      '>Anterior</button>' +
      '<span class="teacher-page-info">Página ' +
      estado.paginaActual +
      " de " +
      totalPaginas +
      " · " +
      total +
      " alumnos</span>" +
      '<button type="button" class="teacher-page-btn" data-page="next"' +
      (estado.paginaActual >= totalPaginas ? " disabled" : "") +
      ">Siguiente</button>";
  }

  function saludoSegunHora() {
    var hora = new Date().getHours();
    if (hora < 12) {
      return "Buenos días";
    }
    if (hora < 19) {
      return "Buenas tardes";
    }
    return "Buenas noches";
  }

  function primerNombreDesdeTexto(nombreCompleto) {
    var partes = String(nombreCompleto || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    return partes.length ? partes[0] : "";
  }

  function aplicarSaludoMaestro(nombreCompleto) {
    if (!elGreeting) {
      return;
    }
    var primerNombre = primerNombreDesdeTexto(nombreCompleto);
    var saludo = saludoSegunHora();
    elGreeting.textContent = primerNombre
      ? saludo + ", " + primerNombre
      : saludo;
  }

  async function pintarSaludoMaestro() {
    var nombreCompleto = "";
    try {
      if (typeof authObtenerSesion === "function") {
        var sesion = await authObtenerSesion();
        if (sesion && sesion.user) {
          var meta = sesion.user.user_metadata || {};
          nombreCompleto = meta.full_name || "";
        }
      }
      if (!nombreCompleto && typeof authCargarPerfil === "function") {
        var perfil = await authCargarPerfil();
        if (perfil) {
          nombreCompleto = [perfil.nombre, perfil.apellido]
            .filter(Boolean)
            .join(" ")
            .trim();
        }
      }
    } catch (e) {
      console.warn("[teacher-dashboard] saludo:", e);
    }
    aplicarSaludoMaestro(nombreCompleto);
  }

  // Rellena el <select> de filtro por grupo
  function pintarSelectGrupos() {
    if (!elGrupoFilter) {
      return;
    }
    var grupos = teacherLeerGrupos();
    if (!grupos.length) {
      grupos = [{ id: "grupo-todos", nombre: "Todos los alumnos", sistema: true }];
    }
    elGrupoFilter.innerHTML = "";
    for (var i = 0; i < grupos.length; i++) {
      var g = grupos[i];
      var opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent =
        g.nombre || (g.sistema ? "Todos los alumnos" : "Grupo sin nombre");
      if (g.id === estado.grupoId) {
        opt.selected = true;
      }
      elGrupoFilter.appendChild(opt);
    }
  }

  // Columnas: Alumno + temas o prácticas
  function pintarCabeceraTabla() {
    var cols = columnasTabla();
    var html = "<th>Alumno</th>";
    for (var i = 0; i < cols.length; i++) {
      var etiqueta = esVistaNiveles() ? cols[i].corto : cols[i].corto;
      var titulo = esVistaNiveles() ? cols[i].titulo : cols[i].nombre;
      if (!esVistaNiveles()) {
        titulo =
          (titulo || etiqueta) + " · En cada celda: B = Básico, A = Avanzado";
        html +=
          '<th title="' +
          escHtml(titulo || etiqueta) +
          '">' +
          escHtml(etiqueta) +
          "</th>";
        continue;
      }
      var logoSrc =
        typeof teacherUrlLogoPractica === "function"
          ? teacherUrlLogoPractica(cols[i])
          : "../MAIN DUCK/BACKGROUND/Quiz_default.png";
      html +=
        '<th class="teacher-th-practica" title="' +
        escHtml(titulo || etiqueta) +
        '">' +
        '<img class="teacher-th-practica-logo" src="' +
        escAttr(logoSrc) +
        '" alt="" width="36" height="36" />' +
        '<span class="teacher-th-practica-label">' +
        escHtml(etiqueta) +
        "</span></th>";
    }
    elHead.innerHTML = html;
  }

  // --- Detalle expandido de un alumno ---

  // Al abrir detalle, elige tema/modo o práctica/intento por defecto
  function resetSeleccionDetalle(detalle) {
    if (esVistaNiveles()) {
      var columnas =
        typeof teacherColumnasNivelesMaestro === "function"
          ? teacherColumnasNivelesMaestro()
          : [];
      if (typeof teacherPrimerNivelConIntentos === "function" && detalle) {
        estado.detalleNivelId = teacherPrimerNivelConIntentos(detalle, columnas);
      } else {
        estado.detalleNivelId = columnas.length ? columnas[0].id : null;
      }
      estado.detalleTemaId = null;
      estado.detalleModoId = null;
      var itNivel =
        typeof teacherIntentoSeleccionadoNivel === "function"
          ? teacherIntentoSeleccionadoNivel(
              detalle,
              estado.detalleNivelId,
              null
            )
          : null;
      estado.detalleIntentoId = itNivel ? itNivel.id : null;
      return;
    }

    estado.detalleNivelId = null;
    if (typeof teacherPrimerTemaConIntentos === "function" && detalle) {
      estado.detalleTemaId = teacherPrimerTemaConIntentos(detalle);
    } else {
      estado.detalleTemaId = "t1";
    }
    if (typeof teacherPrimerModoConIntentos === "function" && detalle) {
      estado.detalleModoId = teacherPrimerModoConIntentos(
        detalle,
        estado.detalleTemaId
      );
    } else {
      estado.detalleModoId = "FACIL";
    }
    var it =
      typeof teacherIntentoSeleccionado === "function"
        ? teacherIntentoSeleccionado(
            detalle,
            estado.detalleTemaId,
            null,
            estado.detalleModoId
          )
        : null;
    estado.detalleIntentoId = it ? it.id : null;
  }

  // FACIL → "Básico", DIFICIL → "Avanzado" (para la UI)
  function modoLabelUi(modoId) {
    return String(modoId || "").toUpperCase() === "DIFICIL" ? "Avanzado" : "Básico";
  }

  function modoKeyUi(modoId) {
    return String(modoId || "").toUpperCase() === "DIFICIL" ? "dificil" : "facil";
  }

  function tiempoPromedioTareasIntento(tareas) {
    if (!tareas || !tareas.length) {
      return 0;
    }
    var sum = 0;
    var n = 0;
    for (var i = 0; i < tareas.length; i++) {
      var t = tareas[i];
      if (!t || t.omitida || t.contestada === false) {
        continue;
      }
      if (t.tiempo > 0) {
        sum += t.tiempo;
        n += 1;
      }
    }
    return n ? Math.round(sum / n) : 0;
  }

  function htmlPromedioTiempoIntento(tareas) {
    var tiempoIntento = tiempoPromedioTareasIntento(tareas);
    if (tiempoIntento > 0) {
      return "⏱ Promedio de este intento: " + tiempoIntento + "s";
    }
    return "⏱ Sin datos de tiempo todavía";
  }

  // Junta tema, modo, lista de intentos y el intento activo según el estado
  function vistaDetalleAlumno(alumno) {
    var d = alumno.detalle || teacherDetalleVacio();
    var temaId = estado.detalleTemaId || d.temaActivo || "t1";
    var modoId = estado.detalleModoId;
    if (!modoId) {
      if (typeof teacherPrimerModoConIntentos === "function") {
        modoId = teacherPrimerModoConIntentos(d, temaId);
      } else {
        modoId = "FACIL";
      }
      estado.detalleModoId = modoId;
    }
    var intentosTema =
      typeof teacherIntentosPorTema === "function"
        ? teacherIntentosPorTema(d.intentos, temaId, modoId)
        : [];
    var intento =
      typeof teacherIntentoSeleccionado === "function"
        ? teacherIntentoSeleccionado(
            d,
            temaId,
            estado.detalleIntentoId,
            modoId
          )
        : null;
    if (intento && String(intento.id) !== String(estado.detalleIntentoId)) {
      estado.detalleIntentoId = intento.id;
    }
    if (!intentosTema.length) {
      estado.detalleIntentoId = null;
    }
    return {
      detalle: d,
      temaId: temaId,
      modoId: modoId,
      tema: teacherNombreTema(temaId),
      intentosTema: intentosTema,
      intento: intento
    };
  }

  // Se quedó sin vidas (GAME_OVER)
  function esPartidaSinVidas(estadoPartida) {
    return String(estadoPartida || "").toUpperCase() === "GAME_OVER";
  }

  function vistaDetalleNiveles(alumno) {
    var d = alumno.detalle || teacherDetalleVacio();
    var columnas =
      typeof teacherColumnasNivelesMaestro === "function"
        ? teacherColumnasNivelesMaestro()
        : [];
    var nivelId = estado.detalleNivelId;
    if (!nivelId && columnas.length) {
      nivelId = columnas[0].id;
      estado.detalleNivelId = nivelId;
    }
    var intentosNivel =
      typeof teacherIntentosPorNivelMaestro === "function"
        ? teacherIntentosPorNivelMaestro(d.intentos, nivelId)
        : [];
    var intento =
      typeof teacherIntentoSeleccionadoNivel === "function"
        ? teacherIntentoSeleccionadoNivel(
            d,
            nivelId,
            estado.detalleIntentoId
          )
        : null;
    if (intento && String(intento.id) !== String(estado.detalleIntentoId)) {
      estado.detalleIntentoId = intento.id;
    }
    if (!intentosNivel.length) {
      estado.detalleIntentoId = null;
    }
    return {
      detalle: d,
      nivelId: nivelId,
      nivel:
        typeof teacherNombreNivelMaestro === "function"
          ? teacherNombreNivelMaestro(nivelId)
          : { titulo: "Nivel", corto: "Nivel" },
      columnas: columnas,
      intentosNivel: intentosNivel,
      intento: intento
    };
  }

  function htmlBotonEliminarAlumno(alumno) {
    return (
      '<button type="button" class="teacher-btn-delete-alumno" data-eliminar-alumno="' +
      escHtml(String(alumno.id)) +
      '">Eliminar alumno</button>'
    );
  }

  // Panel desplegable para prácticas creadas por el maestro
  function htmlDetalleNiveles(alumno) {
    var vista = vistaDetalleNiveles(alumno);
    var intento = vista.intento;
    var intentosNivel = vista.intentosNivel;
    var nivel = vista.nivel;
    var tareas = intento ? intento.tareas || [] : [];
    var estadoIntento = intento ? intento.estado : "";
    var tareasHtml = "";

    if (!tareas.length) {
      tareasHtml =
        '<tr><td colspan="4">' +
        escHtml(
          !intentosNivel.length
            ? "El alumno aún no ha intentado la práctica «" +
                (nivel.titulo || nivel.corto) +
                "»."
            : "Selecciona un intento para ver el detalle."
        ) +
        "</td></tr>";
    }
    for (var i = 0; i < tareas.length; i++) {
      var t = tareas[i];
      var noContestada = esPartidaSinVidas(estadoIntento) && t.omitida;
      var resultado = htmlResultadoTarea(t, estadoIntento);
      tareasHtml +=
        "<tr><td>" +
        escHtml(t.texto || "Pregunta " + (i + 1)) +
        "</td><td>" +
        resultado +
        "</td><td>" +
        (noContestada ? "—" : t.errores) +
        "</td><td>" +
        (noContestada || t.contestada === false ? "—" : t.tiempo + "s") +
        "</td></tr>";
    }

    var intentosHtml = "";
    if (!intentosNivel.length) {
      intentosHtml =
        '<li class="teacher-intento-empty">' +
        escHtml("Aún no hay intentos en esta práctica.") +
        "</li>";
    }
    for (var k = 0; k < intentosNivel.length; k++) {
      var it = intentosNivel[k];
      var selIntento =
        intento && String(it.id) === String(intento.id) ? " is-selected" : "";
      intentosHtml +=
        '<li class="teacher-intento ' +
        claseEstadoIntento(it.estado) +
        selIntento +
        '" role="button" tabindex="0" data-detalle-intento="' +
        escHtml(String(it.id)) +
        '">' +
        '<div class="teacher-intento-head">' +
        "<strong>" +
        escHtml(formatearFechaPartida(it.fecha)) +
        "</strong>" +
        '<span class="teacher-intento-estado">' +
        escHtml(it.estadoLabel || it.estado || "—") +
        "</span>" +
        "</div>" +
        '<div class="teacher-intento-meta">' +
        (it.aciertos != null ? it.aciertos : 0) +
        "/" +
        (it.total || 0) +
        " · Vidas: " +
        (it.vidasRestantes != null ? it.vidasRestantes : "—") +
        "</div>" +
        htmlBarrasIntento(it) +
        "</li>";
    }

    var nivelesHtml = "";
    for (var j = 0; j < vista.columnas.length; j++) {
      var col = vista.columnas[j];
      var celdaPractica =
        typeof teacherNivelMaestroCelda === "function"
          ? teacherNivelMaestroCelda(alumno, col)
          : { ok: 0, total: col.totalPreguntas || 0, enCurso: false };
      var selNivel = String(col.id) === String(vista.nivelId) ? " is-selected" : "";
      nivelesHtml +=
        '<li><button type="button" class="teacher-tema-btn' +
        selNivel +
        (celdaPractica.enCurso ? " teacher-tema-btn--en-curso" : "") +
        '" data-detalle-nivel="' +
        escHtml(String(col.id)) +
        '" title="' +
        escHtml(
          (col.titulo || col.corto) +
            (celdaPractica.enCurso ? " · en curso" : "")
        ) +
        '">' +
        escHtml(col.corto) +
        ": " +
        celdaPractica.ok +
        "/" +
        celdaPractica.total +
        (celdaPractica.enCurso ? " · en curso" : "") +
        "</button></li>";
    }

    var porcentajeAciertos = intento ? intento.porcentajeAciertos || 0 : 0;
    var tituloIntento = intento
      ? formatearFechaPartida(intento.fecha) +
        " · " +
        (intento.estadoLabel || intento.estado || "—")
      : !intentosNivel.length
        ? "Sin intentos"
        : "Elige un intento";

    return (
      '<div class="teacher-detail">' +
      '<div class="teacher-detail-header">' +
      "<h3 class=\"teacher-detail-title\">" +
      escHtml(alumno.nombre) +
      " — " +
      escHtml(nivel.titulo || nivel.corto) +
      "</h3>" +
      '<div class="teacher-detail-progress">' +
      "<label>Porcentaje de aciertos</label>" +
      barraPorcentajeAciertosHtml(porcentajeAciertos) +
      "</div></div>" +
      '<div class="teacher-detail-body">' +
      '<div class="teacher-detail-side">' +
      '<p class="teacher-detail-side-title">Elegir práctica</p>' +
      '<ul class="teacher-levels-mini teacher-temas-select">' +
      nivelesHtml +
      "</ul>" +
      '<p class="teacher-detail-side-title">Intentos · ' +
      escHtml(nivel.corto || nivel.titulo) +
      " (" +
      intentosNivel.length +
      ")</p>" +
      '<ul class="teacher-intentos">' +
      intentosHtml +
      "</ul></div>" +
      '<div class="teacher-detail-main">' +
      '<p class="teacher-detail-side-title">Detalle · ' +
      escHtml(tituloIntento) +
      "</p>" +
      '<table class="teacher-tasks"><thead><tr><th>Actividad</th><th>Resultado</th><th>Errores</th><th>Tiempo</th></tr></thead><tbody>' +
      tareasHtml +
      "</tbody></table></div></div>" +
      '<div class="teacher-detail-footer">' +
      htmlBotonEliminarAlumno(alumno) +
      '<span class="teacher-avg-time">' +
      escHtml(htmlPromedioTiempoIntento(tareas)) +
      "</span>" +
      '<button type="button" class="teacher-btn-collapse" data-collapse>Contraer</button>' +
      "</div></div>"
    );
  }

  // Todo el panel desplegable: temas, modos, intentos y tabla de tareas
  function htmlDetalle(alumno) {
    if (esVistaNiveles()) {
      return htmlDetalleNiveles(alumno);
    }
    var vista = vistaDetalleAlumno(alumno);
    var d = vista.detalle;
    var tema = vista.tema;
    var intento = vista.intento;
    var intentosTema = vista.intentosTema;
    var tareas = intento ? intento.tareas || [] : [];
    var estadoIntento = intento ? intento.estado : "";
    var modoLabel = modoLabelUi(vista.modoId);
    var sinIntentosModo = !intentosTema.length;
    var tareasHtml = "";
    if (!tareas.length) {
      tareasHtml =
        '<tr><td colspan="4">' +
        escHtml(
          sinIntentosModo
            ? "El alumno aún no ha intentado el nivel " +
                modoLabel.toLowerCase() +
                " de " +
                tema.corto +
                "."
            : "Selecciona un intento para ver el detalle."
        ) +
        "</td></tr>";
    }
    for (var i = 0; i < tareas.length; i++) {
      var t = tareas[i];
      var noContestada = esPartidaSinVidas(estadoIntento) && t.omitida;
      var resultado = htmlResultadoTarea(t, estadoIntento);
      tareasHtml +=
        "<tr><td>" +
        escHtml(t.texto || "Pregunta " + (i + 1)) +
        "</td><td>" +
        resultado +
        "</td><td>" +
        (noContestada ? "—" : t.errores) +
        "</td><td>" +
        (noContestada || t.contestada === false ? "—" : t.tiempo + "s") +
        "</td></tr>";
    }

    var intentosHtml = "";
    if (!intentosTema.length) {
      intentosHtml =
        '<li class="teacher-intento-empty">' +
        escHtml(
          "Aún no hay intentos de nivel " + modoLabel.toLowerCase() + "."
        ) +
        "</li>";
    }
    for (var k = 0; k < intentosTema.length; k++) {
      var it = intentosTema[k];
      var selIntento =
        intento && String(it.id) === String(intento.id) ? " is-selected" : "";
      intentosHtml +=
        '<li class="teacher-intento ' +
        claseEstadoIntento(it.estado) +
        selIntento +
        '" role="button" tabindex="0" data-detalle-intento="' +
        escHtml(String(it.id)) +
        '">' +
        '<div class="teacher-intento-head">' +
        "<strong>" +
        escHtml(formatearFechaPartida(it.fecha)) +
        "</strong>" +
        '<span class="teacher-intento-estado">' +
        escHtml(it.estadoLabel || it.estado || "—") +
        "</span>" +
        "</div>" +
        '<div class="teacher-intento-meta">' +
        escHtml(it.nivel || "—") +
        " · " +
        (it.aciertos != null ? it.aciertos : 0) +
        "/" +
        (it.total || 0) +
        " · Vidas: " +
        (it.vidasRestantes != null ? it.vidasRestantes : "—") +
        "</div>" +
        htmlBarrasIntento(it) +
        "</li>";
    }

    var nivelesHtml = "";
    var modoKey = modoKeyUi(vista.modoId);
    for (var j = 0; j < TEACHER_TEMAS.length; j++) {
      var tid = TEACHER_TEMAS[j].id;
      var slotTema =
        typeof teacherTemaModoCelda === "function"
          ? teacherTemaModoCelda(alumno, tid, modoKey)
          : { pts: 0, enCurso: false, tiempoPromedio: 0 };
      var pts = slotTema.pts || 0;
      var selTema = tid === vista.temaId ? " is-selected" : "";
      var tituloTema =
        (TEACHER_TEMAS[j].nombre || TEACHER_TEMAS[j].corto) +
        " · " +
        modoLabelUi(vista.modoId) +
        ": " +
        pts +
        "/10" +
        (slotTema.enCurso ? " (en curso)" : "");
      nivelesHtml +=
        '<li><button type="button" class="teacher-tema-btn' +
        selTema +
        (slotTema.enCurso ? " teacher-tema-btn--en-curso" : "") +
        '" data-detalle-tema="' +
        escHtml(tid) +
        '" title="' +
        escHtml(tituloTema) +
        '">' +
        escHtml(TEACHER_TEMAS[j].corto) +
        ": " +
        pts +
        "/10" +
        (slotTema.enCurso ? " · en curso" : "") +
        "</button></li>";
    }

    var modosHtml = "";
    var modos = [
      { id: "FACIL", label: "Básico" },
      { id: "DIFICIL", label: "Avanzado" }
    ];
    for (var m = 0; m < modos.length; m++) {
      var mid = modos[m].id;
      var selModo = mid === vista.modoId ? " is-selected" : "";
      modosHtml +=
        '<li><button type="button" class="teacher-tema-btn teacher-modo-btn' +
        selModo +
        '" data-detalle-modo="' +
        escHtml(mid) +
        '">' +
        escHtml(modos[m].label) +
        "</button></li>";
    }

    var porcentajeAciertos = intento ? intento.porcentajeAciertos || 0 : 0;
    var tituloIntento = intento
      ? formatearFechaPartida(intento.fecha) +
        " · " +
        (intento.estadoLabel || intento.estado || "—")
      : sinIntentosModo
        ? "Sin intentos de nivel " + modoLabel.toLowerCase()
        : "Elige un intento";

    return (
      '<div class="teacher-detail">' +
      '<div class="teacher-detail-header">' +
      "<h3 class=\"teacher-detail-title\">" +
      escHtml(alumno.nombre) +
      " — " +
      escHtml(tema.nombre) +
      " · " +
      escHtml(modoLabel) +
      "</h3>" +
      '<div class="teacher-detail-progress">' +
      "<label>Porcentaje de aciertos</label>" +
      barraPorcentajeAciertosHtml(porcentajeAciertos) +
      "</div></div>" +
      '<div class="teacher-detail-body">' +
      '<div class="teacher-detail-side">' +
      '<p class="teacher-detail-side-title">Elegir tema</p>' +
      '<ul class="teacher-levels-mini teacher-temas-select">' +
      nivelesHtml +
      "</ul>" +
      '<p class="teacher-detail-side-title">Modo</p>' +
      '<ul class="teacher-levels-mini teacher-modos-select">' +
      modosHtml +
      "</ul>" +
      '<p class="teacher-detail-side-title">Intentos · ' +
      escHtml(tema.corto) +
      " · " +
      escHtml(modoLabel) +
      " (" +
      intentosTema.length +
      ")</p>" +
      '<ul class="teacher-intentos">' +
      intentosHtml +
      "</ul></div>" +
      '<div class="teacher-detail-main">' +
      '<p class="teacher-detail-side-title">Detalle · ' +
      escHtml(tituloIntento) +
      "</p>" +
      '<table class="teacher-tasks"><thead><tr><th>Actividad</th><th>Resultado</th><th>Errores</th><th>Tiempo</th></tr></thead><tbody>' +
      tareasHtml +
      "</tbody></table></div></div>" +
      '<div class="teacher-detail-footer">' +
      htmlBotonEliminarAlumno(alumno) +
      '<span class="teacher-avg-time">' +
      escHtml(htmlPromedioTiempoIntento(tareas)) +
      "</span>" +
      '<button type="button" class="teacher-btn-collapse" data-collapse>Contraer</button>' +
      "</div></div>"
    );
  }

  function alumnoPorId(id) {
    var lista = esVistaNiveles()
      ? typeof teacherAlumnosNivelesEnGrupo === "function"
        ? teacherAlumnosNivelesEnGrupo(estado.grupoId)
        : []
      : typeof teacherAlumnosEnGrupo === "function"
        ? teacherAlumnosEnGrupo(estado.grupoId)
        : [];
    for (var i = 0; i < lista.length; i++) {
      if (String(lista[i].id) === String(id)) {
        return lista[i];
      }
    }
    return null;
  }

  function actualizarBotonConfirmarEliminar() {
    var btn = document.getElementById("btn-confirmar-eliminar-alumno");
    var input = document.getElementById("eliminar-alumno-confirm-input");
    if (!btn || !input || !_alumnoEliminarPendiente) {
      if (btn) {
        btn.disabled = true;
      }
      return;
    }
    var esperado = String(_alumnoEliminarPendiente.nombre || "").trim();
    btn.disabled = String(input.value || "").trim() !== esperado;
  }

  function abrirModalEliminarAlumno(alumno) {
    if (!modalEliminarAlumno || !alumno) {
      return;
    }
    _alumnoEliminarPendiente = alumno;
    var nombreEl = document.getElementById("eliminar-alumno-nombre");
    var emailEl = document.getElementById("eliminar-alumno-email");
    var esperadoEl = document.getElementById("eliminar-alumno-esperado");
    var input = document.getElementById("eliminar-alumno-confirm-input");
    if (nombreEl) {
      nombreEl.textContent = alumno.nombre || "Alumno";
    }
    if (emailEl) {
      emailEl.textContent = alumno.email || "";
    }
    if (esperadoEl) {
      esperadoEl.textContent = alumno.nombre || "";
    }
    if (input) {
      input.value = "";
    }
    actualizarBotonConfirmarEliminar();
    modalEliminarAlumno.hidden = false;
    modalEliminarAlumno.removeAttribute("hidden");
    document.body.classList.add("teacher-modal-open");
    actualizarScrollTopDashboard();
    if (input) {
      window.setTimeout(function () {
        input.focus();
      }, 50);
    }
  }

  function cerrarModalEliminarAlumno() {
    if (!modalEliminarAlumno) {
      return;
    }
    _alumnoEliminarPendiente = null;
    modalEliminarAlumno.hidden = true;
    modalEliminarAlumno.setAttribute("hidden", "");
    if (!modalGrupos || modalGrupos.hidden) {
      document.body.classList.remove("teacher-modal-open");
    }
    actualizarScrollTopDashboard();
  }

  async function ejecutarEliminarAlumno() {
    if (!_alumnoEliminarPendiente) {
      return;
    }
    var alumno = _alumnoEliminarPendiente;
    var btn = document.getElementById("btn-confirmar-eliminar-alumno");
    if (btn) {
      btn.disabled = true;
    }
    if (typeof uiMostrarCarga === "function") {
      uiMostrarCarga("teacher-eliminar-alumno", "Eliminando alumno…");
    }
    try {
      if (typeof teacherEliminarAlumnoAsync !== "function") {
        throw new Error("No se pudo cargar la acción de eliminación.");
      }
      await teacherEliminarAlumnoAsync(alumno.dbId || alumno.id);
      cerrarModalEliminarAlumno();
      estado.expandidoId = null;
      limpiarSeleccionDetalle();
      pintarTabla();
      if (typeof uiToastSuccess === "function") {
        uiToastSuccess("Alumno eliminado correctamente.");
      }
    } catch (e) {
      var msg =
        typeof maestroErrorAmigable === "function"
          ? maestroErrorAmigable(e, "eliminarAlumno")
          : "No se pudo eliminar al alumno.";
      if (typeof uiToastError === "function") {
        uiToastError(msg);
      } else {
        window.alert(msg);
      }
      actualizarBotonConfirmarEliminar();
    } finally {
      if (typeof uiOcultarCarga === "function") {
        uiOcultarCarga("teacher-eliminar-alumno");
      }
    }
  }

  // Pinta filas de alumnos, barras por tema y la fila expandida si toca
  function pintarTabla() {
    try {
    var listaCompleta = listaAlumnosFiltrada();
    var total = listaCompleta.length;
    pintarPaginacion(total);
    var inicio = (estado.paginaActual - 1) * TEACHER_POR_PAGINA;
    var lista = listaCompleta.slice(inicio, inicio + TEACHER_POR_PAGINA);
    elBody.innerHTML = "";
    elBody.setAttribute("aria-busy", "false");

    if (!lista.length) {
      elEmpty.hidden = false;
      var errCarga =
        typeof teacherUltimoErrorCarga === "function"
          ? teacherUltimoErrorCarga()
          : null;
      if (errCarga) {
        elEmpty.textContent =
          "No se pudieron cargar los alumnos: " + errCarga;
      } else if (
        esVistaNiveles() &&
        !numColumnasTabla() &&
        (!estado.grupoId || estado.grupoId === "grupo-todos")
      ) {
        elEmpty.textContent =
          "Aún no has creado prácticas. Usa «Mis niveles» para armar la primera.";
      } else {
        elEmpty.textContent =
          !estado.grupoId || estado.grupoId === "grupo-todos"
            ? "Aún no hay alumnos inscritos para mostrar."
            : "No hay alumnos en este grupo.";
      }
      return;
    }
    if (esVistaNiveles() && !numColumnasTabla()) {
      elEmpty.hidden = false;
      elEmpty.textContent =
        "Aún no has creado prácticas. Usa «Mis niveles» para armar la primera.";
      if (elPaginacion) {
        elPaginacion.hidden = true;
      }
      return;
    }

    elEmpty.hidden = true;

    for (var i = 0; i < lista.length; i++) {
      var a = lista[i];
      var tr = document.createElement("tr");
      tr.setAttribute("data-student-id", a.id);
      if (estado.expandidoId === a.id) {
        tr.classList.add("is-expanded");
      }

      var celdas =
        '<td><div class="teacher-student">' +
        (typeof duckHtmlAvatarMini === "function"
          ? duckHtmlAvatarMini(a.outfit, a.avatarVersion)
          : '<div class="teacher-avatar teacher-avatar--emoji" aria-hidden="true">🦆</div>') +
        "<div><p class=\"teacher-student-name\">" +
        escHtml(a.nombre) +
        '</p><p class="teacher-student-email">' +
        escHtml(a.email) +
        "</p></div></div></td>";

      var cols = columnasTabla();
      for (var j = 0; j < cols.length; j++) {
        var col = cols[j];
        var barra;
        var celdaCls = "teacher-cell-bar";
        if (esVistaNiveles()) {
          var celdaPractica =
            typeof teacherNivelMaestroCelda === "function"
              ? teacherNivelMaestroCelda(a, col)
              : { ok: 0, total: col.totalPreguntas || 0, enCurso: false };
          barra = barraPracticaMaestroHtml(
            celdaPractica.ok,
            celdaPractica.total,
            celdaPractica.enCurso
          );
        } else {
          celdaCls += " teacher-cell-bar--dual";
          barra = htmlCeldaTemaFijo(a, col.id, col.nombre || col.corto);
        }
        celdas +=
          '<td class="' +
          celdaCls +
          '"' +
          (esVistaNiveles()
            ? ' title="' +
              escHtml(
                (col.titulo || col.corto) +
                  (celdaPractica.enCurso ? " · en curso" : "")
              ) +
              '"'
            : "") +
          ">" +
          barra +
          "</td>";
      }

      tr.innerHTML = celdas;
      elBody.appendChild(tr);

      if (estado.expandidoId === a.id) {
        var trExp = document.createElement("tr");
        trExp.className = "teacher-expand-row";
        var td = document.createElement("td");
        td.colSpan = numColumnasTabla() + 1;
        td.innerHTML = htmlDetalle(a);
        trExp.appendChild(td);
        elBody.appendChild(trExp);
      }
    }
    } finally {
      actualizarModoScrollTabla();
    }
  }

  // Vuelve a pedir temas fijos y prácticas al servidor y repinta la tabla
  function recargarDatosMaestro() {
    var promesas = [];
    if (typeof teacherCargarAlumnos === "function") {
      promesas.push(teacherCargarAlumnos());
    }
    if (typeof teacherCargarAlumnosNivelesMaestro === "function") {
      promesas.push(teacherCargarAlumnosNivelesMaestro());
    }
    if (!promesas.length) {
      pintarTabla();
      return Promise.resolve();
    }
    return Promise.all(promesas).then(function () {
      pintarCabeceraTabla();
      pintarTabla();
    });
  }

  function cambiarVistaDashboard(vista) {
    if (!vista || vista === estado.vistaDashboard) {
      return;
    }
    estado.vistaDashboard = vista;
    estado.paginaActual = 1;
    estado.expandidoId = null;
    limpiarSeleccionDetalle();
    pintarTabsVista();
    pintarCabeceraTabla();
    pintarTabla();
  }

  // Abre o cierra el detalle de un alumno; si abre, trae intentos del servidor
  function toggleExpand(id) {
    if (estado.expandidoId === id) {
      estado.expandidoId = null;
      limpiarSeleccionDetalle();
      pintarTabla();
      return;
    }
    estado.expandidoId = id;
    limpiarSeleccionDetalle();
    pintarTabla();

    var alumno = null;
    var lista = esVistaNiveles()
      ? typeof teacherAlumnosNivelesEnGrupo === "function"
        ? teacherAlumnosNivelesEnGrupo(estado.grupoId)
        : []
      : teacherAlumnosEnGrupo(estado.grupoId);
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === id) {
        alumno = lista[i];
        break;
      }
    }
    var cargarDetalle = esVistaNiveles()
      ? teacherCargarDetalleAlumnoNivelesMaestro
      : teacherCargarDetalleAlumno;
    if (!alumno || typeof cargarDetalle !== "function") {
      return;
    }

    cargarDetalle(alumno.dbId || alumno.id)
      .then(function (det) {
        alumno.detalle = det;
        resetSeleccionDetalle(det);
        if (estado.expandidoId === id) {
          pintarTabla();
        }
      })
      .catch(function (e) {
        console.warn("[teacher] detalle:", e);
      });
  }

  // --- Grupos: modal, asignar alumnos, crear/borrar ---

  var ICONO_COPIAR =
    '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>' +
    "</svg>";

  function copiarTextoPortapapeles(texto) {
    function copiarFallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = texto;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        var copiado = document.execCommand("copy");
        document.body.removeChild(ta);
        return copiado;
      } catch (e) {
        return false;
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(texto).then(function () {
        return true;
      }).catch(function () {
        return copiarFallback();
      });
    }
    return Promise.resolve(copiarFallback());
  }

  function copiarCodigoGrupo(codigo, btn) {
    if (!codigo) {
      return;
    }
    copiarTextoPortapapeles(codigo).then(function (ok) {
      if (!ok) {
        if (typeof uiToastError === "function") {
          uiToastError("No se pudo copiar. Selecciona el código manualmente.");
        }
        return;
      }
      if (btn) {
        btn.classList.add("is-copied");
        btn.setAttribute("aria-label", "Código copiado");
        var label = btn.querySelector(".teacher-grupo-copiar-label");
        if (label) {
          label.textContent = "Copiado";
        }
        window.setTimeout(function () {
          btn.classList.remove("is-copied");
          btn.setAttribute("aria-label", "Copiar código " + codigo);
          if (label) {
            label.textContent = "Copiar";
          }
        }, 1800);
      }
      if (typeof uiToastSuccess === "function") {
        uiToastSuccess("Código copiado: " + codigo);
      }
    });
  }

  // Lista de grupos dentro del modal (nombre, código, asignar/eliminar)
  function pintarListaGrupos() {
    var ul = document.getElementById("lista-grupos");
    if (!ul) {
      return;
    }
    var grupos = teacherLeerGrupos();
    ul.innerHTML = "";

    for (var i = 0; i < grupos.length; i++) {
      var g = grupos[i];
      var li = document.createElement("li");
      var acciones = "";
      if (!g.sistema) {
        acciones =
          '<div class="teacher-grupo-actions">' +
          '<button type="button" class="teacher-btn-asignar" data-asignar="' +
          escHtml(g.id) +
          '">Asignar</button>' +
          '<button type="button" class="teacher-btn-borrar" data-borrar="' +
          escHtml(g.id) +
          '">Eliminar</button>' +
          "</div>";
      } else {
        acciones =
          '<span style="font-size:0.78rem;color:#64748b">Vista general</span>';
      }
      var codigoHtml = "";
      if (!g.sistema && g.codigo) {
        codigoHtml =
          '<div class="teacher-grupo-codigo-row">' +
          '<span class="teacher-grupo-codigo" title="Código para que se unan tus alumnos">' +
          escHtml(g.codigo) +
          "</span>" +
          '<button type="button" class="teacher-grupo-copiar" data-copiar-codigo="' +
          escHtml(g.codigo) +
          '" title="Copiar código" aria-label="Copiar código ' +
          escHtml(g.codigo) +
          '">' +
          ICONO_COPIAR +
          '<span class="teacher-grupo-copiar-label">Copiar</span>' +
          "</button>" +
          "</div>";
      }
      li.innerHTML =
        "<div class=\"teacher-grupo-info\"><strong>" +
        escHtml(g.nombre) +
        "</strong>" +
        codigoHtml +
        "</div>" +
        acciones;
      ul.appendChild(li);
    }
  }

  // Nombre legible de un grupo por su id de UI
  function nombreGrupoPorId(grupoId) {
    var grupos = teacherLeerGrupos();
    for (var i = 0; i < grupos.length; i++) {
      if (grupos[i].id === grupoId) {
        return grupos[i].nombre || grupoId;
      }
    }
    return grupoId;
  }

  // Impide desmarcar si el alumno quedaría sin ningún grupo
  function validarDesmarcarAlumnoGrupo(input, grupoId) {
    if (!input || input.checked) {
      return true;
    }
    var alumnoId = input.getAttribute("data-alumno");
    var alumnos = teacherListarAlumnos();
    var alumno = null;
    for (var i = 0; i < alumnos.length; i++) {
      if (String(alumnos[i].id) === String(alumnoId)) {
        alumno = alumnos[i];
        break;
      }
    }
    if (!alumno) {
      return true;
    }
    var enEsteGrupo = (alumno.grupos || []).indexOf(grupoId) >= 0;
    if (!enEsteGrupo) {
      return true;
    }
    var otros = (alumno.grupos || []).filter(function (g) {
      return g !== grupoId && g !== "grupo-todos";
    });
    if (otros.length) {
      return true;
    }
    input.checked = true;
    if (typeof uiToastError === "function") {
      uiToastError(
        "«" +
          (alumno.nombre || "El alumno") +
          "» no puede quedar sin grupo. Asígnalo primero a otro grupo."
      );
    }
    return false;
  }

  // Muestra checkboxes para meter/quitar alumnos de un grupo
  function abrirAsignacion(grupoId) {
    var grupos = teacherLeerGrupos();
    var nombre = grupoId;
    for (var i = 0; i < grupos.length; i++) {
      if (grupos[i].id === grupoId) {
        nombre = grupos[i].nombre;
        break;
      }
    }
    estado.grupoAsignarId = grupoId;
    document.getElementById("asignar-grupo-nombre").textContent = nombre;
    document.getElementById("seccion-asignar").hidden = false;

    var ul = document.getElementById("lista-asignar-alumnos");
    ul.innerHTML = "";
    var alumnos = teacherListarAlumnos();

    if (!alumnos.length) {
      ul.innerHTML =
        '<li class="teacher-asignar-empty">Aún no hay alumnos inscritos.</li>';
      return;
    }

    for (var j = 0; j < alumnos.length; j++) {
      var a = alumnos[j];
      var checked = (a.grupos || []).indexOf(grupoId) >= 0;
      var otrosGrupos = (a.grupos || []).filter(function (g) {
        return g !== grupoId && g !== "grupo-todos";
      });
      var etiquetaGrupo =
        otrosGrupos.length && !checked
          ? " · " + nombreGrupoPorId(otrosGrupos[0])
          : "";
      var li = document.createElement("li");
      li.innerHTML =
        '<label><input type="checkbox" data-alumno="' +
        escHtml(a.id) +
        '"' +
        (checked ? " checked" : "") +
        "> " +
        escHtml(a.nombre) +
        escHtml(etiquetaGrupo) +
        "</label>";
      ul.appendChild(li);
    }
  }

  // Guarda quién quedó marcado en la asignación y cierra la sección
  function guardarAsignacion() {
    if (!estado.grupoAsignarId) {
      return;
    }
    var gid = estado.grupoAsignarId;
    var btn = document.getElementById("btn-guardar-asignacion");
    if (btn && btn.disabled) {
      return;
    }
    var checks = document.querySelectorAll(
      "#lista-asignar-alumnos input[type=checkbox]"
    );
    var marcados = [];
    for (var c = 0; c < checks.length; c++) {
      if (checks[c].checked) {
        marcados.push(checks[c].getAttribute("data-alumno"));
      }
    }

    if (btn) {
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
      if (!btn.dataset.labelOriginal) {
        btn.dataset.labelOriginal = btn.textContent;
      }
      btn.textContent = "Guardando…";
    }
    if (typeof uiMostrarCarga === "function") {
      uiMostrarCarga(
        "teacher-asignacion-loading",
        typeof str === "function"
          ? str("maestro.guardandoAsignacion", "Guardando asignación…")
          : "Guardando asignación…"
      );
    }

    var prom =
      typeof teacherGuardarAsignacionGrupo === "function"
        ? teacherGuardarAsignacionGrupo(gid, marcados)
        : Promise.resolve();

    prom
      .then(function () {
        document.getElementById("seccion-asignar").hidden = true;
        estado.grupoAsignarId = null;
        estado.grupoId = "grupo-todos";
        if (elGrupoFilter) {
          elGrupoFilter.value = "grupo-todos";
        }
        pintarSelectGrupos();
        if (esVistaNiveles()) {
          pintarCabeceraTabla();
        }
        pintarTabla();
        if (typeof uiToastSuccess === "function") {
          uiToastSuccess("Asignación guardada.");
        }
      })
      .catch(function (e) {
        if (typeof uiToastError === "function") {
          uiToastError(
            typeof maestroErrorAmigable === "function"
              ? maestroErrorAmigable(e, "grupo")
              : e.message || "No se pudo guardar la asignación."
          );
        }
      })
      .finally(function () {
        if (typeof uiOcultarCarga === "function") {
          uiOcultarCarga("teacher-asignacion-loading");
        }
        if (btn) {
          btn.disabled = false;
          btn.removeAttribute("aria-busy");
          btn.textContent = btn.dataset.labelOriginal || "Guardar asignación";
        }
      });
  }

  // Crea grupo nuevo y refresca listas del modal y el select
  function crearGrupo(nombre) {
    nombre = String(nombre || "").trim();
    if (!nombre) {
      return Promise.resolve(null);
    }
    return Promise.resolve(
      typeof gruposCrear === "function" ? gruposCrear(nombre) : null
    ).then(function (nuevo) {
      if (!nuevo) {
        return null;
      }
      pintarListaGrupos();
      pintarSelectGrupos();
      return nuevo;
    });
  }

  // Borra un grupo; si era el filtro activo, vuelve a "todos"
  function borrarGrupo(id) {
    var prom =
      typeof gruposEliminar === "function"
        ? gruposEliminar(id)
        : Promise.resolve(true);
    return prom
      .then(function () {
        if (estado.grupoId === id) {
          estado.grupoId = "grupo-todos";
        }
        pintarListaGrupos();
        pintarSelectGrupos();
        pintarTabla();
      })
      .catch(function (e) {
        if (typeof uiToastError === "function") {
          uiToastError(
            typeof maestroErrorAmigable === "function"
              ? maestroErrorAmigable(e, "grupo")
              : "No se pudo eliminar el grupo."
          );
        }
      });
  }

  // Abre el modal de grupos; opcionalmente enfoca el input de nombre
  function abrirModalGrupos(enfocarNombre) {
    if (!modalGrupos) {
      if (typeof uiToastError === "function") {
        uiToastError("No se pudo abrir la ventana de grupos. Recarga la página.");
      }
      return;
    }
    var seccionAsignar = document.getElementById("seccion-asignar");
    if (seccionAsignar) {
      seccionAsignar.hidden = true;
    }
    pintarListaGrupos();
    modalGrupos.hidden = false;
    modalGrupos.removeAttribute("hidden");
    document.body.classList.add("teacher-modal-open");
    actualizarScrollTopDashboard();
    if (enfocarNombre) {
      var inp = document.getElementById("input-nombre-grupo");
      if (inp) {
        window.setTimeout(function () {
          inp.focus();
        }, 50);
      }
    }
  }

  // Cierra modal y quita el bloqueo de scroll del body
  function cerrarModalGrupos() {
    if (!modalGrupos) {
      return;
    }
    modalGrupos.hidden = true;
    modalGrupos.setAttribute("hidden", "");
    document.body.classList.remove("teacher-modal-open");
    actualizarScrollTopDashboard();
  }

  // Muestra u oculta el botón flotante "subir arriba" según scroll y modal
  function actualizarScrollTopDashboard() {
    var btn = document.getElementById("teacher-scroll-top");
    if (!btn) {
      return;
    }
    var umbral = 280;
    var scrollY =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    var modalAbierto = document.body.classList.contains("teacher-modal-open");
    if (!modalAbierto && scrollY > umbral) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }
  }

  // Engancha scroll, resize y click del botón subir (solo una vez)
  function registrarScrollTopDashboard() {
    var btn = document.getElementById("teacher-scroll-top");
    if (!btn || btn.getAttribute("data-hook") === "1") {
      return;
    }
    btn.setAttribute("data-hook", "1");
    window.addEventListener("scroll", actualizarScrollTopDashboard, {
      passive: true
    });
    window.addEventListener("resize", actualizarScrollTopDashboard);
    btn.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
    actualizarScrollTopDashboard();
  }

  // --- Eventos: búsqueda, filtros, tabla, grupos y paginación ---

  // Todos los listeners del panel (tabla, modal, formularios...)
  function registrarEventos() {
    if (!elSearch || !elGrupoFilter || !elBody) {
      return;
    }

    elSearch.addEventListener("input", function () {
      estado.busqueda = elSearch.value;
      estado.paginaActual = 1;
      pintarTabla();
    });

    elGrupoFilter.addEventListener("change", function () {
      estado.grupoId = elGrupoFilter.value;
      estado.paginaActual = 1;
      estado.expandidoId = null;
      limpiarSeleccionDetalle();
      pintarTabla();
    });

    var vistaTabs = document.querySelectorAll(".teacher-view-tab");
    for (var vt = 0; vt < vistaTabs.length; vt++) {
      vistaTabs[vt].addEventListener("click", function () {
        cambiarVistaDashboard(this.getAttribute("data-vista"));
      });
    }

    elBody.addEventListener("click", function (ev) {
      var eliminarBtn = ev.target.closest("[data-eliminar-alumno]");
      if (eliminarBtn) {
        ev.preventDefault();
        ev.stopPropagation();
        var alumnoElim = alumnoPorId(eliminarBtn.getAttribute("data-eliminar-alumno"));
        if (alumnoElim) {
          abrirModalEliminarAlumno(alumnoElim);
        }
        return;
      }
      if (ev.target.closest("[data-collapse]")) {
        estado.expandidoId = null;
        limpiarSeleccionDetalle();
        pintarTabla();
        return;
      }
      var nivelBtn = ev.target.closest("[data-detalle-nivel]");
      if (nivelBtn) {
        ev.preventDefault();
        ev.stopPropagation();
        estado.detalleNivelId = nivelBtn.getAttribute("data-detalle-nivel");
        estado.detalleIntentoId = null;
        pintarTabla();
        return;
      }
      var temaBtn = ev.target.closest("[data-detalle-tema]");
      if (temaBtn) {
        ev.preventDefault();
        ev.stopPropagation();
        estado.detalleTemaId = temaBtn.getAttribute("data-detalle-tema");
        estado.detalleIntentoId = null;
        pintarTabla();
        return;
      }
      var modoBtn = ev.target.closest("[data-detalle-modo]");
      if (modoBtn) {
        ev.preventDefault();
        ev.stopPropagation();
        estado.detalleModoId = modoBtn.getAttribute("data-detalle-modo");
        estado.detalleIntentoId = null;
        pintarTabla();
        return;
      }
      var intentoBtn = ev.target.closest("[data-detalle-intento]");
      if (intentoBtn) {
        ev.preventDefault();
        ev.stopPropagation();
        estado.detalleIntentoId = intentoBtn.getAttribute("data-detalle-intento");
        pintarTabla();
        return;
      }
      var tr = ev.target.closest("tr[data-student-id]");
      if (!tr || ev.target.closest(".teacher-expand-row")) {
        return;
      }
      toggleExpand(tr.getAttribute("data-student-id"));
    });

    elBody.addEventListener("keydown", function (ev) {
      if (ev.key !== "Enter" && ev.key !== " ") {
        return;
      }
      var intentoBtn = ev.target.closest("[data-detalle-intento]");
      if (!intentoBtn) {
        return;
      }
      ev.preventDefault();
      estado.detalleIntentoId = intentoBtn.getAttribute("data-detalle-intento");
      pintarTabla();
    });

    var btnGrupos = document.getElementById("btn-grupos");
    if (btnGrupos) {
      btnGrupos.addEventListener("click", function () {
        abrirModalGrupos(true);
      });
    }

    if (modalGrupos) {
      modalGrupos.querySelectorAll("[data-close-modal]").forEach(function (el) {
        el.addEventListener("click", cerrarModalGrupos);
      });
    }

    if (modalEliminarAlumno) {
      modalEliminarAlumno
        .querySelectorAll("[data-close-modal-eliminar]")
        .forEach(function (el) {
          el.addEventListener("click", cerrarModalEliminarAlumno);
        });
    }

    var inputConfirmEliminar = document.getElementById("eliminar-alumno-confirm-input");
    if (inputConfirmEliminar) {
      inputConfirmEliminar.addEventListener("input", actualizarBotonConfirmarEliminar);
    }

    var btnConfirmEliminar = document.getElementById("btn-confirmar-eliminar-alumno");
    if (btnConfirmEliminar) {
      btnConfirmEliminar.addEventListener("click", function () {
        ejecutarEliminarAlumno();
      });
    }

    document.addEventListener("keydown", function (ev) {
      if (ev.key !== "Escape") {
        return;
      }
      if (modalEliminarAlumno && !modalEliminarAlumno.hidden) {
        cerrarModalEliminarAlumno();
        return;
      }
      if (modalGrupos && !modalGrupos.hidden) {
        cerrarModalGrupos();
      }
    });

    if (elPaginacion) {
      elPaginacion.addEventListener("click", function (ev) {
        var btn = ev.target.closest("[data-page]");
        if (!btn || btn.disabled) {
          return;
        }
        var dir = btn.getAttribute("data-page");
        if (dir === "prev" && estado.paginaActual > 1) {
          estado.paginaActual--;
          pintarTabla();
        } else if (dir === "next") {
          estado.paginaActual++;
          pintarTabla();
        }
      });
    }

    var formNuevoGrupo = document.getElementById("form-nuevo-grupo");
    if (!formNuevoGrupo) {
      return;
    }

    formNuevoGrupo.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var inp = document.getElementById("input-nombre-grupo");
      crearGrupo(inp.value).then(function (g) {
        inp.value = "";
        inp.focus();
        if (g) {
          var aviso = document.getElementById("grupo-codigo-aviso");
          if (aviso) {
            aviso.hidden = true;
            aviso.textContent = "";
          }
        }
      }).catch(function (e) {
        if (typeof uiToastError === "function") {
          uiToastError(
            typeof maestroErrorAmigable === "function"
              ? maestroErrorAmigable(e, "grupo")
              : "No se pudo crear el grupo."
          );
        }
      });
    });

    document.getElementById("lista-grupos").addEventListener("click", function (ev) {
      var copiar = ev.target.closest("[data-copiar-codigo]");
      if (copiar) {
        ev.preventDefault();
        copiarCodigoGrupo(
          copiar.getAttribute("data-copiar-codigo"),
          copiar
        );
        return;
      }
      var asignar = ev.target.closest("[data-asignar]");
      if (asignar) {
        abrirAsignacion(asignar.getAttribute("data-asignar"));
        return;
      }
      var borrar = ev.target.closest("[data-borrar]");
      if (borrar) {
        if (confirm("¿Eliminar este grupo? Los alumnos no se borran.")) {
          borrarGrupo(borrar.getAttribute("data-borrar"));
        }
      }
    });

    document.getElementById("btn-guardar-asignacion").addEventListener("click", guardarAsignacion);

    var listaAsignar = document.getElementById("lista-asignar-alumnos");
    if (listaAsignar) {
      listaAsignar.addEventListener("change", function (ev) {
        var input = ev.target.closest('input[type="checkbox"][data-alumno]');
        if (!input || !estado.grupoAsignarId) {
          return;
        }
        validarDesmarcarAlumnoGrupo(input, estado.grupoAsignarId);
      });
    }
  }

  // Refresco completo de cabecera, select de grupos y tabla
  function pintarDashboard() {
    pintarTabsVista();
    pintarCabeceraTabla();
    pintarSelectGrupos();
    pintarTabla();
    if (modalGrupos && !modalGrupos.hidden) {
      pintarListaGrupos();
    }
  }

  // --- Arranque: sesión, carga inicial, skeleton y primer pintado ---

  // Punto de entrada: eventos, skeleton, sesión, grupos+alumnos, pintar
  function init() {
    aplicarSaludoMaestro("");
    registrarEventos();
    registrarScrollTopDashboard();
    pintarCabeceraTabla();
    pintarSelectGrupos();
    pintarSkeletonTabla(7);

    if (typeof uiMostrarCarga === "function") {
      uiMostrarCarga(
        "teacher-loading",
        typeof str === "function"
          ? str("maestro.cargandoPanel", "Cargando alumnos…")
          : "Cargando alumnos…"
      );
    }

    var arranque = Promise.resolve(true);
    if (typeof teacherExigirSesionAsync === "function") {
      arranque = teacherExigirSesionAsync().then(function (ok) {
        if (!ok) {
          sesionLista = false;
          return false;
        }
        sesionLista = true;
        return pintarSaludoMaestro().then(function () {
          return true;
        });
      });
    } else {
      sesionLista = true;
      arranque = pintarSaludoMaestro().then(function () {
        return true;
      });
    }

    arranque
      .then(function (ok) {
        if (ok === false) {
          if (typeof uiOcultarCarga === "function") {
            uiOcultarCarga("teacher-loading");
          }
          return;
        }
        var cargarGrupos =
          typeof gruposInicializar === "function"
            ? gruposInicializar()
            : Promise.resolve([]);
        return cargarGrupos.then(function () {
          var cargarAlumnos =
            typeof teacherCargarAlumnos === "function"
              ? teacherCargarAlumnos()
              : Promise.resolve([]);
          var cargarPracticas =
            typeof teacherCargarAlumnosNivelesMaestro === "function"
              ? teacherCargarAlumnosNivelesMaestro()
              : Promise.resolve([]);
          return Promise.all([cargarAlumnos, cargarPracticas]);
        }).then(
          function () {
            var err =
              typeof teacherUltimoErrorCarga === "function"
                ? teacherUltimoErrorCarga()
                : null;
            if (err && typeof uiToastError === "function") {
              uiToastError(
                typeof maestroErrorAmigable === "function"
                  ? maestroErrorAmigable(err, "panel")
                  : "No se pudo cargar el panel."
              );
            }
            pintarDashboard();
          }
        );
      })
      .catch(function (err) {
        console.error("Error cargando panel del maestro:", err);
        if (typeof uiToastError === "function") {
          uiToastError("No se pudieron cargar los datos del panel.");
        }
        pintarDashboard();
      })
      .finally(function () {
        if (typeof uiOcultarCarga === "function") {
          uiOcultarCarga("teacher-loading");
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Al volver con bfcache (atrás del navegador), refresca avatares/datos
  window.addEventListener("pageshow", function () {
    if (!sesionLista) {
      return;
    }
    recargarDatosMaestro().catch(function (err) {
      console.warn("No se pudieron refrescar datos del panel:", err);
    });
  });
})();
