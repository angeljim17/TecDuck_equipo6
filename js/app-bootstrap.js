/**
 * Carga scripts comunes de Tec-Duck en orden.
 * Uso en HTML:
 *   <script src="../js/app-bootstrap.js" data-preset="login" data-page="../js/login.js"></script>
 */
(function () {
  "use strict";

  var JS = "../js/";
  var CDN_SUPABASE = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  var CDN_JSXGRAPH = "https://cdn.jsdelivr.net/npm/jsxgraph@1.12.2/distrib/jsxgraphcore.js";

  var MODULES = {
    rutas: JS + "rutas.js",
    config: JS + "supabase-config.js",
    supabaseCdn: CDN_SUPABASE,
    supabaseClient: JS + "supabase-client.js",
    auth: JS + "auth-service.js",
    strings: JS + "strings.js",
    authValidacion: JS + "auth-validacion.js",
    authPassword: JS + "auth-password-toggle.js",
    grupos: JS + "grupos-clase.js",
    uiToast: JS + "ui-toast.js",
    pageLoadOverlay: JS + "page-load-overlay.js",
    uiLoading: JS + "ui-loading.js",
    duckCatalog: JS + "duck-catalog.js",
    duckOutfit: JS + "duck-outfit.js",
    duckEconomia: JS + "duck-economia-sync.js",
    duckAvatar: JS + "duck-avatar-sync.js",
    alumnoGuard: JS + "alumno-guard.js",
    teacherAuth: JS + "teacher-auth.js",
    teacherNiveles: JS + "teacher-niveles.js",
    teacherNivelesDb: JS + "teacher-niveles-db.js",
    teacherNivelesUi: JS + "teacher-niveles-ui.js",
    temasConfig: JS + "temas-config.js",
    partidaActividad: JS + "partida-actividad.js",
    topicProgressData: JS + "topic-progress-data.js",
    topicProgressUi: JS + "topic-progress-ui.js",
    alumnoCambioMaestro: JS + "alumno-cambio-maestro.js",
    signupMaestros: JS + "signup-maestros.js",
    teacherData: JS + "teacher-data.js",
    teacherDashboardState: JS + "teacher-dashboard-state.js",
    quizHelpers: JS + "quiz-helpers.js",
    quizSync: JS + "quiz-sync.js",
    quizUi: JS + "quiz-ui.js",
    quizBankLoader: JS + "quiz-bank-loader.js",
    teacherDashHtml: JS + "teacher-dashboard-html.js",
    quizData: JS + "quiz-data.js",
    quizOptionJxg: JS + "quiz-option-jxg.js",
    quizJxgPreview: JS + "quiz-jxg-preview.js",
    jsxgraphCdn: CDN_JSXGRAPH
  };

  var CORE = ["rutas", "config", "supabaseCdn", "supabaseClient", "auth", "strings"];

  var PRESETS = {
    login: CORE.concat(["authValidacion", "authPassword", "grupos"]),
    signup: CORE.concat([
      "authValidacion",
      "authPassword",
      "grupos",
      "signupMaestros"
    ]),
    "alumno-base": CORE.concat([
      "uiToast",
      "pageLoadOverlay",
      "grupos",
      "duckCatalog",
      "duckOutfit",
      "duckEconomia",
      "duckAvatar",
      "alumnoGuard"
    ]),
    "alumno-topics": CORE.concat([
      "uiToast",
      "pageLoadOverlay",
      "grupos",
      "duckCatalog",
      "duckOutfit",
      "duckEconomia",
      "duckAvatar",
      "alumnoGuard",
      "teacherNiveles",
      "teacherNivelesDb",
      "temasConfig",
      "partidaActividad",
      "topicProgressData",
      "topicProgressUi",
      "alumnoCambioMaestro"
    ]),
    "join-group": CORE.concat(["uiToast", "pageLoadOverlay", "grupos", "alumnoGuard"]),
    teacher: CORE.concat([
      "uiToast",
      "pageLoadOverlay",
      "grupos",
      "teacherAuth",
      "teacherNiveles",
      "teacherNivelesDb"
    ]),
    "teacher-dashboard": CORE.concat([
      "uiToast",
      "uiLoading",
      "pageLoadOverlay",
      "teacherDashHtml",
      "grupos",
      "teacherAuth",
      "duckCatalog",
      "temasConfig",
      "partidaActividad",
      "teacherData",
      "teacherDashboardState"
    ]),
    quiz: CORE.concat([
      "uiToast",
      "pageLoadOverlay",
      "duckCatalog",
      "duckOutfit",
      "duckAvatar",
      "duckEconomia",
      "grupos",
      "temasConfig",
      "teacherNiveles",
      "teacherNivelesDb",
      "teacherAuth",
      "partidaActividad",
      "topicProgressData",
      "topicProgressUi",
      "alumnoGuard",
      "quizHelpers",
      "quizSync",
      "quizUi",
      "quizBankLoader",
      "quizData",
      "jsxgraphCdn",
      "quizOptionJxg",
      "quizJxgPreview"
    ])
  };

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = function () {
        resolve();
      };
      s.onerror = function () {
        reject(new Error("No se pudo cargar: " + src));
      };
      document.head.appendChild(s);
    });
  }

  function expandKeys(keys) {
    var out = [];
    var seen = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!key || seen[key]) {
        continue;
      }
      seen[key] = true;
      if (MODULES[key]) {
        out.push(MODULES[key]);
      } else if (key.indexOf("/") >= 0 || key.indexOf(".js") >= 0) {
        out.push(key);
      }
    }
    return out;
  }

  function loadKeys(keys) {
    var urls = expandKeys(keys);
    return urls.reduce(function (chain, url) {
      return chain.then(function () {
        return loadScript(url);
      });
    }, Promise.resolve());
  }

  function parseExtraList(raw) {
    if (!raw) {
      return [];
    }
    return raw
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
  }

  window.appBootstrapLoad = loadKeys;

  var tag = document.currentScript;
  if (!tag) {
    return;
  }

  var presetName = tag.getAttribute("data-preset");
  if (!presetName) {
    return;
  }

  var preset = PRESETS[presetName];
  if (!preset) {
    console.error("[app-bootstrap] Preset desconocido:", presetName);
    return;
  }

  var keys = preset.slice();
  keys = keys.concat(parseExtraList(tag.getAttribute("data-extra")));

  var pages = parseExtraList(tag.getAttribute("data-page"));
  if (pages.length) {
    keys = keys.concat(pages);
  }

  loadKeys(keys).catch(function (err) {
    console.error("[app-bootstrap]", err);
    if (presetName !== "login" && presetName !== "signup") {
      return;
    }
    var aviso = document.createElement("p");
    aviso.setAttribute("role", "alert");
    aviso.style.cssText =
      "margin:1rem;padding:1rem;background:#fee;border:1px solid #c00;border-radius:8px;color:#900;font-family:sans-serif;";
    aviso.textContent =
      "Falta js/supabase-config.js. Copia js/supabase-config.example.js, renómbralo y pega tus credenciales de Supabase.";
    document.body.insertBefore(aviso, document.body.firstChild);
  });
})();
