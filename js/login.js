/**
 * Lógica de login.html: valida el formulario, llama a authIniciarSesion
 * y redirige al dashboard del maestro o a la ruta del alumno.
 */


function loginMsg(path, fallback) {
  return typeof str === "function" ? str(path, fallback) : fallback;
}

// Precalienta Supabase y enlaza el botón de entrar.
function loginInit() {
  if (typeof initSupabase === "function") {
    initSupabase();
  }
  var btn = document.getElementById("btn-login");
  if (btn) {
    btn.addEventListener("click", entrar);
  }
  var passEl = document.getElementById("pass");
  if (passEl) {
    passEl.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") {
        ev.preventDefault();
        entrar();
      }
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loginInit);
} else {
  loginInit();
}

// Handler del submit: valida, loguea y manda según el rol.
async function entrar() {
  var correoEl = document.getElementById("email");
  var passEl = document.getElementById("pass");
  var correo = correoEl ? correoEl.value : "";
  var pass = passEl ? passEl.value : "";
  var btn = document.querySelector(".btn-submit");
  var errBox = document.getElementById("login-error");
  var btnLabel = btn ? btn.textContent : "";

  // Pinta el error en la caja o, si no hay, usa alert.
  function mostrarError(msg) {
    if (!errBox) {
      if (msg) {
        window.alert(msg);
      }
      return;
    }
    if (msg) {
      errBox.textContent = msg;
      errBox.hidden = false;
    } else {
      errBox.hidden = true;
      errBox.textContent = "";
    }
  }

  mostrarError("");

  if (typeof authValidarFormularioLogin === "function") {
    var validacion = authValidarFormularioLogin(correo, pass);
    if (!validacion.ok) {
      mostrarError(validacion.error);
      return;
    }
    correo = validacion.email;
  } else if (!correo.trim() || !pass) {
    mostrarError(
      loginMsg("auth.loginDatosIncompletos", "Ingresa tu correo y contraseña.")
    );
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = "Entrando…";
  }

  // Vuelve el botón a su estado original tras un fallo.
  function restaurarBoton() {
    if (btn) {
      btn.disabled = false;
      btn.textContent = btnLabel;
    }
  }

  if (typeof authIniciarSesion !== "function" || typeof initSupabase !== "function") {
    mostrarError(loginMsg("auth.servicioNoDisponible", "Supabase no está configurado."));
    restaurarBoton();
    return;
  }

  try {
    await initSupabase();
    var resultado = await authIniciarSesion(correo, pass);
    if (resultado.perfil.rol === "MAESTRO") {
      if (typeof gruposInicializar === "function") {
        await gruposInicializar();
      }
      window.location.href =
        typeof pagina === "function"
          ? pagina("teacher-dashboard.html")
          : "teacher-dashboard.html";
      return;
    }
    await redirigirAlumnoTrasLogin(correo);
  } catch (e) {
    mostrarError(
      typeof authTraducirError === "function"
        ? authTraducirError(e, "login")
        : e.message || loginMsg("auth.loginFallido", "No se pudo iniciar sesión.")
    );
    restaurarBoton();
  }
}
