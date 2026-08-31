# Physics Modelation Quest (Tec-Duck)

Plataforma web gamificada para que estudiantes del Tecnológico de Monterrey practiquen conceptos de **física** (enfoque en **vectores**) mediante niveles progresivos, retroalimentación inmediata, puntos, monedas, vidas y personalización del avatar **Tec-Duck**.

**Curso:** Construcción de Software y toma de decisiones (601) — ITESM Campus Puebla  
**Proyecto:** Ciclo 3 — Proyecto Final

| Alumno | Matrícula |
|--------|-----------|
| Angel Jiménez Morales | A01735807 |
| Miguel Angel Monroy Posada | A01739891 |
| Polo Rivera Cortes | A01739901 |

---

## Contenido del proyecto

El sistema cubre las siguientes épicas principales:

| Épica | Descripción |
|-------|-------------|
| 1 | Aprendizaje progresivo de vectores (niveles, desbloqueo, retroalimentación) |
| 2 | Evaluación y retroalimentación gamificada (puntos, progreso, explicaciones) |
| 3 | Gestión y seguimiento del progreso (estudiante y panel del profesor) |
| 4 | Registro e inicio de sesión de usuarios |
| 5 | Personalización del avatar Tec-Duck |
| 6 | Economía y tienda virtual (monedas, compras) |
| 7 | Sistema de vidas y penalización por errores |

**Actores:** Estudiante (principal), Profesor (seguimiento), Administrador del sistema.

**Alcance:** Piloto en Campus Puebla; temas básicos de vectores; aplicación web para navegadores modernos.

**Limitaciones:** Contenido centrado en vectores; no requiere servidor propio (infraestructura en la nube).

---

## Arquitectura e infraestructura

```
┌─────────────────┐     HTTPS      ┌──────────────────┐
│  Navegador      │ ──────────────►│  Netlify         │
│  (HTML/CSS/JS)  │                │  (sitio estático)│
└────────┬────────┘                └──────────────────┘
         │
         │  API REST + Auth
         ▼
┌─────────────────┐
│  Supabase       │
│  PostgreSQL +   │
│  Authentication │
└─────────────────┘
```

| Componente | Rol |
|------------|-----|
| **Frontend** | HTML, CSS y JavaScript vanilla (sin framework) |
| **Supabase** | Base de datos PostgreSQL, autenticación y Row Level Security (RLS) |
| **Netlify** | Hosting del sitio estático y reglas de rutas (`serve.json`) |

**Dependencias del frontend (CDN, no requieren `npm install`):**

| Librería | Uso | CDN |
|----------|-----|-----|
| `@supabase/supabase-js` v2 | Cliente de Supabase | `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2` |
| `jsxgraph` v1.12.2 | Gráficos en preguntas del quiz | `https://cdn.jsdelivr.net/npm/jsxgraph@1.12.2/distrib/` |

---

## Prerrequisitos del entorno

### Para instalar y evaluar la aplicación (obligatorio)

- Cuenta en [Supabase](https://supabase.com) (plan gratuito suficiente para pruebas).
- Cuenta en [Netlify](https://app.netlify.com) (opcional, para publicar en internet).
- Navegador actualizado: Chrome, Edge, Firefox o Safari.
- Conexión a internet (acceso a Supabase, Netlify y jsDelivr CDN).
- JavaScript habilitado en el navegador.

### Para desarrollo local (opcional)

- Editor de texto o IDE (VS Code, Notepad++, etc.).
- Servidor HTTP local para probar rutas y módulos (ver sección [Desarrollo local](#desarrollo-local)).

### Para scripts de mantenimiento `.mjs` (opcional)

- **Node.js 18 o superior** (soporta ES modules nativos).
- **No se requiere `npm install`**: los scripts en `scripts/` usan solo módulos nativos de Node (`fs`, `path`, `url`).

---

## Estructura del repositorio

```
Tec_duck/
├── index.html              # Redirige a pages/index.html
├── serve.json              # Reglas de rutas para Netlify
├── database/
│   ├── 01_esquema_y_funciones.sql   # Paso 1: esquema + funciones
│   ├── 02_seguridad_rls.sql         # Paso 2: políticas RLS
│   ├── 03_borrar_alumnos.sql        # Opcional: limpiar alumnos (pruebas)
│   └── 04_crear_maestro.sql         # Paso 4: alta de maestro por SQL
├── js/
│   ├── supabase-config.example.js  # Plantilla — copiar a supabase-config.js
│   ├── supabase-config.js          # Tus credenciales (no se sube a Git)
│   ├── app-bootstrap.js            # Carga común de scripts por página
│   ├── supabase-client.js          # Cliente singleton de Supabase
│   └── ...                         # Lógica de auth, quiz, tienda, maestro, etc.
├── pages/                   # Pantallas HTML de la aplicación
├── css/                     # Estilos
├── banco-preguntas/         # Preguntas por tema y dificultad
├── MAIN DUCK/               # Assets del avatar y fondos
└── scripts/
    ├── sync-catalog-to-sql.mjs      # Genera SQL desde duck-catalog.js
    └── split-teacher-css.mjs        # Divide CSS del panel maestro
```

---

## Instalación paso a paso

Tiempo estimado: **30–45 minutos**.

### Paso 0 — Configurar credenciales de Supabase (obligatorio)

El archivo `js/supabase-config.js` **no viene en el repositorio** (cada quien usa su propio proyecto Supabase).

1. Copia la plantilla:

```bash
# Windows (PowerShell)
Copy-Item js\supabase-config.example.js js\supabase-config.js

# macOS / Linux
cp js/supabase-config.example.js js/supabase-config.js
```

2. Edita `js/supabase-config.js` y pega tu **SUPABASE_URL** y **SUPABASE_ANON_KEY** (ver Paso 4).

Sin este archivo la app no puede conectarse a la base de datos.

### Paso 1 — Crear proyecto en Supabase

1. Entra a https://supabase.com e inicia sesión o crea cuenta.
2. Clic en **New project**.
3. Completa el formulario (nombre sugerido: `tec-duck`, región cercana a México, contraseña de BD segura).
4. Espera 1–3 minutos hasta que el proyecto esté listo.

### Paso 2 — Crear las tablas de la base de datos

Ejecuta los scripts SQL **en orden** y **uno por uno** en **Supabase → SQL Editor → + New query → Run**:

| Orden | Archivo | Descripción |
|-------|---------|-------------|
| 1 | `database/01_esquema_y_funciones.sql` | Tipos, tablas, funciones y datos iniciales |
| 2 | `database/02_seguridad_rls.sql` | Políticas Row Level Security |

**Verificación:** En **Table Editor** deben aparecer tablas como `usuario`, `profesor`, `alumno`, `grupo`, `pregunta`, `item`, etc.

> **No vuelvas a ejecutar `01` en un proyecto ya configurado.** Si aparece `type "rol_usuario" already exists`, la base ya fue inicializada.

### Paso 3 — Configurar autenticación

1. **Authentication → Sign In / Providers → User Signups**
2. Desactiva **Confirm email** (OFF).
3. Guarda los cambios.

Los alumnos y maestros pueden iniciar sesión sin confirmar correo por enlace.

### Paso 4 — Conectar la aplicación a Supabase

La cadena de conexión del frontend es la **URL del proyecto** y la **clave pública anon** (no la `service_role`).

#### Obtener credenciales en Supabase

1. **Project Settings** (engranaje) → **API Keys** → pestaña **Legacy anon, service_role API keys**
   - Copia la clave **anon public** → es `SUPABASE_ANON_KEY`
2. **Project Settings → Data API**
   - Copia la **API URL** → es `SUPABASE_URL` (formato: `https://xxxx.supabase.co`)

> **Importante:** Nunca uses la clave `service_role` en el frontend. Solo la anon key, porque RLS limita lo que cada usuario puede leer o escribir.

#### Pegar credenciales en el proyecto

Si aún no lo hiciste en el Paso 0, copia `js/supabase-config.example.js` a `js/supabase-config.js` y edita:

```javascript
window.SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

Guarda el archivo. `js/app-bootstrap.js` carga `supabase-config.js` antes del resto de scripts en cada página.

### Paso 5 — Crear el primer maestro (profesor)

Los **alumnos** se registran desde la pantalla **Crear cuenta** de la app.  
Los **maestros** se crean con SQL (no desde el registro público).

1. Abre `database/04_crear_maestro.sql` y edita estas líneas:

```sql
v_email    TEXT := 'profe@escuela.edu';
v_password TEXT := 'Maestro123!';
v_nombre   TEXT := 'María';
v_apellido TEXT := 'García';
```

| Dato | Requisitos |
|------|------------|
| Correo | Único, formato válido |
| Contraseña | Mín. 8 caracteres, mayúscula, minúscula, número y símbolo (`!@#`) |

2. En Supabase → **SQL Editor** → pega el archivo completo → **Run**.
3. Verifica:
   - **Authentication → Users** → aparece el correo del maestro
   - **Table Editor → usuario** → fila con rol `MAESTRO`
   - **Table Editor → profesor** → registro vinculado

4. En la app: **Iniciar sesión** con ese correo y contraseña → debe abrir el panel del maestro.

Para maestros adicionales, repite el paso con otro correo.

### Paso 6 — Publicar en Netlify (opcional)

1. Confirma que `js/supabase-config.js` tiene las credenciales correctas.
2. En https://app.netlify.com, inicia sesión.
3. Arrastra la carpeta del proyecto a **Deploy manually**, o conecta un repositorio Git.
4. Copia la URL asignada (ej. `https://tec-duck.netlify.app`).
5. En Supabase → **Authentication → URL Configuration**:
   - **Site URL** → pega la URL de Netlify → **Save**

El archivo `serve.json` en la raíz define redirecciones de rutas cortas (`/login`, `/signup`, `/quiz`, etc.).

---

## Desarrollo local

La app es estática; no necesita compilación. Para probar rutas y módulos ES correctamente, usa un servidor local:

```bash
# Con Node.js 18+ (npx no requiere instalación global)
npx --yes serve .

# O con Python 3
python -m http.server 8080
```

Abre `http://localhost:3000` (serve) o `http://localhost:8080` (Python) y navega a `pages/index.html` o la raíz si el servidor sirve `index.html`.

> Sin servidor local, algunas rutas con `base href="/pages/"` pueden fallar al abrir archivos directamente con `file://`.

### Carga de scripts (`app-bootstrap.js`)

Las páginas HTML ya no listan decenas de `<script>` a mano. Cada pantalla usa un **preset** en `js/app-bootstrap.js`:

```html
<script src="../js/app-bootstrap.js" data-preset="login" data-page="../js/login.js"></script>
```

Presets disponibles: `login`, `signup`, `alumno-base`, `alumno-topics`, `join-group`, `teacher`, `teacher-dashboard`, `quiz`.

Módulos auxiliares: `js/quiz-helpers.js`, `js/quiz-sync.js`, `js/quiz-ui.js` (quiz); `js/teacher-dashboard-html.js` (panel maestro).

### Pantallas de carga unificadas

Las páginas con overlay usan un marcador vacío que `page-load-overlay.js` convierte en la pantalla de carga:

```html
<div id="page-loading-mount" hidden data-main="Cargando…" data-sub="Un momento…" data-label="Cargando"></div>
```

En el quiz, añade `data-variant="quiz"` para usar los estilos del overlay del quiz.

### Quiz: banco de preguntas dinámico

En `quiz.html` solo se carga el archivo de preguntas del **tema y modo** de la URL (por ejemplo `?tema=2&modo=facil` → `banco-preguntas/tema-2/basico/preguntas.js`). Los niveles del maestro (`?tn=`) no usan el banco local.

---

## Scripts Node.js (`scripts/*.mjs`)

Estos scripts son **herramientas de mantenimiento para desarrolladores**. No son necesarios para instalar ni desplegar la aplicación.

Requisito: **Node.js 18+** (ver `"engines"` en `package.json`).

| Comando npm | Equivalente directo | Descripción |
|-------------|---------------------|-------------|
| `npm run serve` | `npx serve .` | Servidor local para probar la app |
| `npm run sync-catalog` | `node scripts/sync-catalog-to-sql.mjs` | Genera SQL del catálogo de items |
| `npm run split-teacher-css` | `node scripts/split-teacher-css.mjs` | Divide CSS del panel maestro |

Los scripts `.mjs` usan solo módulos nativos de Node (`fs`, `path`, `url`); no requieren `npm install`.

---

## Script SQL opcional: limpiar alumnos

| Archivo | Uso |
|---------|-----|
| `database/03_borrar_alumnos.sql` | **Opcional e irreversible.** Borra solo alumnos y sus datos en entornos de prueba. No forma parte de la instalación inicial. |

---

## Flujo de usuarios

| Rol | Cómo se crea | Acciones principales |
|-----|--------------|----------------------|
| **Alumno** | Registro en la app (`signup.html`) | Resolver preguntas, avanzar niveles, tienda, personalizar Tec-Duck |
| **Maestro** | Script `04_crear_maestro.sql` en Supabase | Ver progreso de alumnos, grupos, niveles personalizados |
| **Administrador** | Mantenimiento técnico vía Supabase | Gestionar BD, usuarios, preguntas |

---

## Errores frecuentes

| Qué ves | Causa | Solución |
|---------|-------|----------|
| `type "rol_usuario" already exists` | `01` ya se ejecutó | No vuelvas a ejecutar `01` completo; pide apoyo técnico |
| `Ya existe una cuenta Auth con el correo...` | Correo de maestro duplicado | Usa otro correo o revisa Authentication → Users |
| Maestro no puede iniciar sesión | Contraseña débil o confirmación de correo activa | Revisa requisitos de contraseña y desactiva Confirm email (Paso 3) |
| La app no conecta a Supabase | URL o anon key incorrectas | Revisa `js/supabase-config.js` |
| Login falla en Netlify | Site URL no configurada | Agrega la URL de Netlify en Supabase → Authentication → URL Configuration |
| Página en blanco o rutas rotas | Sin servidor o `serve.json` | Usa servidor local o despliega en Netlify |

---

## Requerimientos no funcionales (resumen)

| ID | Categoría | Requerimiento |
|----|-----------|---------------|
| RFN1 | Rendimiento | Retroalimentación en menos de 2 segundos |
| RFN2 | Disponibilidad | ≥ 95% en periodos escolares |
| RFN3 | Seguridad | Auth con correo/contraseña; RLS en PostgreSQL |
| RFN4 | Usabilidad | Interfaz intuitiva para estudiantes |
| RFN5 | Compatibilidad | Chrome, Edge, Firefox |

---

## Documentación adicional

El documento **Ciclo 3 — Proyecto Final** (`annotated-Ciclo 3.- Proyecto Final.pdf`) incluye diagramas UML, mockups, planificación MoSCoW, pruebas y video demo.

---

## Licencia y uso

Proyecto académico del ITESM Campus Puebla. Uso educativo.
