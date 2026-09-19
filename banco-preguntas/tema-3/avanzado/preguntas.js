/**
 * Tema 3 · Avanzado — Desafíos de suma y resta de vectores (25 preguntas)
 */
(function () {
  "use strict";
  if (typeof quizBankRegistrar !== "function") {
    throw new Error("Carga quiz-bank-loader.js antes de este archivo.");
  }
  quizBankRegistrar("3", "dificil", [
  {
    id: "T3D01",
    q: "Dados los vectores u = 2î - 3ĵ, v = -î + 4ĵ y w = 3î + 2ĵ, calcula 2u - 3v + w.",
    opts: [
      { t: "4î - 16ĵ", ok: false, fb: "Calculaste bien la coordenada y, pero parece que en x tuviste un traspié con los signos. Al restar vectores multiplicados por escalares, recuerda que restar un negativo se convierte en suma. ¡Revisa tu cálculo de 2u - 3v!" },
      { t: "10î - 16ĵ", ok: true },
      { t: "10î - 4ĵ", ok: false, fb: "¡Tu coordenada x es correcta! Sin embargo, en y sumaste los términos en lugar de aplicar la resta correcta. Si tienes -18 y le sumas 2, ¿hacia dónde se mueve el valor en la recta numérica?" },
      { t: "4î - 4ĵ", ok: false, fb: "Hay un pequeño desajuste en ambos ejes. Te sugiero resolverlo por partes: primero escala el vector u, luego el v, y finalmente agrupa todo con cuidado de los signos negativos." }
    ]
  },
  {
    id: "T3D02",
    q: "Si u + v = 5î + 2ĵ y u - v = î + 6ĵ, ¿cuáles son los vectores u y v?",
    opts: [
      { t: "u = 4î + 3ĵ, v = î - ĵ", ok: false, fb: "Estos vectores cumplen con la primera regla (u + v), pero ¿qué sucede al restarlos? Recuerda que la pareja elegida debe satisfacer ambas ecuaciones al mismo tiempo." },
      { t: "u = 6î + 8ĵ, v = 4î - 4ĵ", ok: false, fb: "Recuerda que al sumar las ecuaciones obtienes el doble del vector original, no el vector simple. ¿Qué operación matemática te falta aplicar a tus coordenadas para despejar los vectores finales?" },
      { t: "u = 2î - 2ĵ, v = 3î + 4ĵ", ok: false, fb: "Planteaste muy bien el sistema de ecuaciones, pero asignaste los valores al revés! Vuelve a revisar qué variable estabas despejando primero al sumar o restar tus ecuaciones." },
      { t: "u = 3î + 4ĵ, v = 2î - 2ĵ", ok: true }
    ]
  },
  {
    id: "T3D03",
    q: "La resultante de dos vectores es 8î - 3ĵ. Si uno de ellos es 5î + 2ĵ, ¿cuál es el otro?",
    opts: [
      { t: "3î - 5ĵ", ok: true },
      { t: "13î - ĵ", ok: false, fb: "Parece que sumaste el vector resultante con el vector que ya conocías. Piensa en esto: si conoces el gran total y una de las partes que lo conforman, debes usar la operación inversa (resta) para descubrir la pieza faltante." },
      { t: "3î - ĵ", ok: false, fb: "Tu cálculo en el eje x es correcto. Para el eje y, te faltó restar con la misma lógica. Si el total es -3 y le quitas 2, ¿qué valor obtienes?" },
      { t: "13î - 5ĵ", ok: false, fb: "Restaste bien la componente vertical, pero sumaste la horizontal. Aplica la fórmula uniformemente a ambas coordenadas." }
    ]
  },
  {
    id: "T3D04",
    q: "Si 2u + v = 7î + ĵ y u - 2v = -4î + 3ĵ, encuentra u.",
    opts: [
      { t: "2î - ĵ", ok: false, fb: "Encontraste la coordenada x correcta, pero la y falló. Al aplicar el método de eliminación multiplicando ecuaciones, vigila muy bien cómo se comportan los signos al sumar las columnas." },
      { t: "î + 2ĵ", ok: false, fb: "Parece que invertiste los valores finales de x e y. Intenta comprobar tu respuesta sustituyendo esta opción directamente en las ecuaciones originales. Verás que los números no encajan." },
      { t: "2î + ĵ", ok: true },
      { t: "î - 2ĵ", ok: false, fb: "Te alejaste un poco del resultado. Plantear un sistema de ecuaciones 2 2 para x y otro para y por separado evitará confusiones y cruces de variables" }
    ]
  },
  {
    id: "T3D05",
    q: "La suma de tres vectores es 0î + 0ĵ. Dos de ellos son a = 2î - 5ĵ y b = -3î + 4ĵ. El tercer vector c es:",
    opts: [
      { t: "5î - 9ĵ", ok: false, fb: "Hubo un error combinando los signos, tal vez sumaste valores absolutos o restaste en la dirección incorrecta. Respeta los signos de cada coordenada original antes de despejar la variable faltante." },
      { t: "-î - ĵ", ok: false, fb: "¡Encontraste la suma de los vectores a y b! Pero la meta es el vector c que equilibre todo para llegar a cero. Si ya estás en (-1, -1), ¿qué movimiento necesitas para volver al origen?" },
      { t: "î + ĵ", ok: true },
      { t: "î - ĵ", ok: false, fb: "Estás muy cerca, pero el signo en y te falló. Si la combinación de los primeros vectores te deja en un valor negativo, necesitas su opuesto exacto para anularlo." }
    ]
  },
  {
    id: "T3D06",
    q: "En un paralelogramo ABCD, A = î + 2ĵ, B = 4î + 3ĵ, C = 6î + 7ĵ. Encuentra el vértice D.",
    opts: [
      { t: "9î + 8ĵ", ok: false, fb: "Sumaste los vértices opuestos A y C y ahí te quedaste. La geometría del paralelogramo indica que la suma de diagonales es igual (A + C = B + D). ¡Aún te falta despejar la D!" },
      { t: "3î + 6ĵ", ok: true },
      { t: "3î + 8ĵ", ok: false, fb: "Tu x es perfecta, pero en y la suma te traicionó. Si da 9, y es 3, ¿qué número falta para completar el 9 en el otro lado de la ecuación?" },
      { t: "9î + 6ĵ", ok: false, fb: "Resolviste bien la componente vertical, pero erraste en la horizontal por no restar correctamente el vértice B al momento de despejar." }
    ]
  },
  {
    id: "T3D07",
    q: "Los puntos medios de los lados de un triángulo son M(2î + 3ĵ), N(4î + 5ĵ) y P(6î + ĵ). Encuentra el vector que va del vértice correspondiente a M al vértice correspondiente a N.",
    opts: [
      { t: "2î + 4ĵ", ok: false, fb: "Escalaste el vector incorrectamente, multiplicando solo una de sus componentes. Cualquier factor escalar debe afectar a ambas coordenadas por igual" },
      { t: "2î + 2ĵ", ok: false, fb: "Encontraste el vector de los puntos medios MN. Sin embargo, la teoría geométrica establece que el lado completo paralelo es proporcional. ¿Acaso debe ser la mitad o el doble?" },
      { t: "4î + 2ĵ", ok: false, fb: "Escalaste el vector incorrectamente, multiplicando solo una de sus componentes. Cualquier factor escalar debe afectar a ambas coordenadas por igual." },
      { t: "4î + 4ĵ", ok: true }
    ]
  },
  {
    id: "T3D08",
    q: "Dados los puntos A(î + 2ĵ), B(5î + 5ĵ) y C(3î + 8ĵ), encuentra el vector que va del vértice A al vértice C del paralelogramo ABCD (con vértices en orden A, B, C, D).",
    opts: [
      { t: "2î + 6ĵ", ok: true },
      { t: "4î + 3ĵ", ok: false, fb: "Ese es el trayecto de A hacia B. El problema pide cruzar el paralelogramo conectando el inicio con el vértice opuesto C." },
      { t: "2î + 3ĵ", ok: false, fb: "Tuviste éxito con el avance lateral (eje x), pero el vertical no cuadra. Si estás en y=2 y vas a y=8, calcula bien la diferencia (Punto Final menos Punto Inicial)." },
      { t: "4î + 6ĵ", ok: false, fb: "La diferencia de altura es correcta, pero la distancia lateral está mal restada. De 1 a 3 hay un trecho más corto que el que marcaste." }
    ]
  },
  {
    id: "T3D09",
    q: "La resultante de dos fuerzas es de 50 N en dirección 30°. Una de las fuerzas es de 30 N en dirección 0°. ¿Cuál es la magnitud y dirección de la otra fuerza?",
    opts: [
      { t: "Aproximadamente 20 N a 30°", ok: false, fb: "Restar directamente las magnitudes de las fuerzas es una trampa muy común. Los vectores no se comportan como números simples; debes descomponer cada fuerza en sus componentes horizontal y vertical usando funciones trigonométricas antes de operarlos." },
      { t: "Aproximadamente 28.3 N a 62°", ok: true },
      { t: "Aproximadamente 40 N a 60°", ok: false, fb: "Este resultado sugiere que usaste el teorema de Pitágoras pensando en un triángulo rectángulo clásico. Sin embargo, este atajo no te dará el resultado correcto si las fuerzas no forman un ángulo exacto de 90° entre sí." },
      { t: "Aproximadamente 76 N a 19°", ok: false, fb: "Parece que sumaste los vectores en lugar de buscar la fuerza faltante. Si ya conoces la resultante y una de las partes que la conforman, la operación que necesitas para hallar la otra pieza es una resta vectorial." }
    ]
  },
  {
    id: "T3D10",
    q: "Un avión vuela 200 km/h en dirección N30°E. El viento sopla a 50 km/h en dirección S45°E. ¿Cuál es la velocidad resultante del avión?",
    opts: [
      { t: "(200 sen30° - 50 sen45°, 200 cos30° + 50 cos45°)", ok: false, fb: "Tienes un signo negativo intruso. Ambos trayectos te llevan hacia el Este, por lo tanto, las componentes horizontales deben sumar esfuerzo, no contrarrestarse." },
      { t: "(200 cos30° + 50 cos45°, 200 sen30° - 50 sen45°)", ok: false, fb: "Intercambiaste las funciones seno y coseno. Al decir \"N30°E\", abres el ángulo desde el eje Y (Norte), por lo que el cateto opuesto (X, este) corresponde al seno." },
      { t: "(200 sen30° + 50 sen45°, 200 cos30° - 50 cos45°)", ok: true },
      { t: "(200 cos30° - 50 cos45°, 200 sen30° + 50 sen45°)", ok: false, fb: "Confundiste qué direcciones suman y restan. Ir al Sur significa que el vector desciende (eje Y negativo), por lo que ese término lleva el signo menos." }
    ]
  },
  {
    id: "T3D11",
    q: "Resuelve para x y y: (2x)î + (y+1)ĵ + (x-1)î + (3y)ĵ = 7î + 8ĵ",
    opts: [
      { t: "x = 8/3, y = 7/4", ok: true },
      { t: "x = 3, y = 2", ok: false, fb: "Es tentador buscar números enteros que se acerquen al resultado, pero en matemáticas vectoriales la precisión es clave. Te sugiero plantear las ecuaciones para cada componente por separado." },
      { t: "x = 8, y = 7", ok: false, fb: "¡Hiciste un gran trabajo agrupando los términos semejantes en cada componente! Sin embargo, olvidaste el último paso del despeje. Si obtienes una ecuación donde la variable está multiplicada por un coeficiente, ¿qué debes hacer para dejarla completamente sola?" },
      { t: "x = 2, y = 1", ok: false, fb: "Si sustituyes estos valores en las ecuaciones originales, notarás que no logras la igualdad buscada. Revisa cuidadosamente cómo agrupaste las variables; recuerda que debes sumar las componentes horizontales por un lado, y las verticales por el otro." }
    ]
  },
  {
    id: "T3D12",
    q: "Si 3u - 2v = 5î - 4ĵ y u + v = 3î + 2ĵ, encuentra u.",
    opts: [
      { t: "u = î + 2ĵ", ok: false, fb: "Hay un error al intentar resolver el sistema por tanteo o cruce de variables. Para ir a la segura, te recomiendo igualar los coeficientes; si la primera ecuación tiene un coeficiente negativo, multiplicar la segunda ecuación te permitirá cancelar esa variable al sumarlas." },
      { t: "u = (4/5)î + 2ĵ", ok: false, fb: "El proceso de eliminación o sustitución que utilizaste es el adecuado, pero este resultado corresponde al vector secundario, no al principal. Asegúrate de leer bien cuál es la incógnita específica que te pide el problema." },
      { t: "u = 2î + ĵ", ok: false, fb: "Si introduces este par en la primera ecuación original, notarás que no consigues la igualdad del otro lado. Multiplica la segunda ecuación entera por 2 para eliminar la variable v y facilitar tu despeje." },
      { t: "u = (11/5)î", ok: true }
    ]
  },
  {
    id: "T3D13",
    q: "La resultante de dos vectores es máxima cuando el ángulo entre ellos es:",
    opts: [
      { t: "270°", ok: false, fb: "Te da el mismo escenario intermedio que los 90°. Piensa: ¿qué ángulo deben tener dos personas para empujar un coche uniendo toda su fuerza hacia adelante?" },
      { t: "90°", ok: false, fb: "Formarías un triángulo rectángulo que da una magnitud fuerte, pero no es el pico máximo." },
      { t: "180°", ok: false, fb: "¡Cuidado! A este ángulo las fuerzas compiten en sentidos opuestos, lo que te generaría la resultante mínima posible." },
      { t: "0°", ok: true }
    ]
  },
  {
    id: "T3D14",
    q: "La resultante de dos vectores es mínima cuando el ángulo entre ellos es:",
    opts: [
      { t: "0°", ok: false, fb: "Aquí las fuerzas corren hombro con hombro, sumando sus capacidades y logrando el valor máximo." },
      { t: "90°", ok: false, fb: "Te darán valores equilibrados intermedios. Para destruir el impacto de una fuerza, otra debe apuntar de frente hacia ella." },
      { t: "180°", ok: true },
      { t: "270°", ok: false, fb: "Te darán valores equilibrados intermedios. Para destruir el impacto de una fuerza, otra debe apuntar de frente hacia ella." }
    ]
  },
  {
    id: "T3D15",
    q: "Dos vectores de magnitudes 8 y 15 tienen resultante de magnitud 17. El ángulo entre ellos es:",
    opts: [
      { t: "0°", ok: false, fb: "Si estuvieran alineados sumando, la resultante sería 8 + 15 = 23." },
      { t: "90°", ok: true },
      { t: "180°", ok: false, fb: "Si chocaran frontalmente, se restarían resultando en 7." },
      { t: "60°", ok: false, fb: "Al insertar este ángulo en la Ley de los Cosenos, la resultante sube por encima de 20. Fíjate en los números 8, 15 y 17; juntos forman una terna pitagórica clásica, lo cual es un indicador directo de que requieren un ángulo recto para cumplir la igualdad trigonométrica." }
    ]
  },
  {
    id: "T3D16",
    q: "Un barco navega 30 km hacia el este, luego 40 km hacia el norte, luego 20 km en dirección S30°O. ¿A qué distancia del punto de partida se encuentra?",
    opts: [
      { t: "√( (30 - 20 sen30°)² + (40 - 20 cos30°)² )", ok: true },
      { t: "√( (30 + 20 sen30°)² + (40 - 20 cos30°)² )", ok: false, fb: "Ir hacia el \"Oeste\" implica movimiento en el eje x negativo. En tu fórmula dejaste ese componente con un signo positivo sumando." },
      { t: "√( (30 - 20 cos30°)² + (40 - 20 sen30°)² )", ok: false, fb: "Cruzaste el seno con el coseno en el tramo final. El ángulo S30°O se recarga sobre el Sur (eje Y), convirtiendo al avance horizontal en el cateto opuesto (seno)." },
      { t: "√( (30 + 20 cos30°)² + (40 + 20 sen30°)² )", ok: false, fb: "Un avance hacia el Suroeste requiere disminuir coordenadas en ambos ejes. Tenías que aplicar restas en ambos componentes dentro de la fórmula final." }
    ]
  },
  {
    id: "T3D17",
    q: "Un robot se mueve según la secuencia: desde el origen va a 2î + 3ĵ, luego a 5î + ĵ, luego a (î + 4ĵ), luego a (4î + 2ĵ). ¿Cuál es su desplazamiento neto?",
    opts: [
      { t: "2î + 4ĵ", ok: false, fb: "Invertiste la posición de los datos. En pares ordenados (x, y), primero reportamos el desplazamiento lateral." },
      { t: "4î + 2ĵ", ok: true },
      { t: "4î - ĵ", ok: false, fb: "Fallaste la suma final de las y. Sin embargo, el \"desplazamiento neto\" tiene un atajo: es simplemente el Punto Final menos el Punto Inicial. Si el último registro dice que aterrizó en (4,2) viniendo del origen, no requieres sumar el viaje intermedio." },
      { t: "12î + 10ĵ", ok: false, fb: "Trataste las posiciones como si fueran flechas directas de fuerza que se acumulan. La redacción es de lugares absolutos en un mapa, el último lugar que pisa es donde termina el asunto." }
    ]
  },
  {
    id: "T3D18",
    q: "La suma de dos vectores es 8î + 3ĵ. La diferencia (primero menos segundo) es 2î + 5ĵ. ¿Cuáles son los vectores?",
    opts: [
      { t: "u = 4î + 5ĵ, v = 4î - 2ĵ", ok: false, fb: "Estos números aprueban la parte de la suma, pero reprueban la resta. Asegúrate de plantear ambas ecuaciones, la de suma y la de resta, de forma conjunta como un sistema, en lugar de intentar deducir los valores por separado." },
      { t: "u = 10î + 8ĵ, v = 6î - 2ĵ", ok: false, fb: "Lograste plantear excelentemente el sistema y hacer las sumas y restas verticales. El detalle está en que los resultados numéricos que obtuviste corresponden al doble de cada vector. Para obtener los vectores originales, te falta dividirlos entre el coeficiente correcto." },
      { t: "u = 3î - ĵ, v = 5î + 4ĵ", ok: false, fb: "Encontraste las magnitudes correctas, ¡pero las asignaste a los vectores equivocados! Revisa detenidamente a qué vector corresponde cada valor al resolver tu resta." },
      { t: "u = 5î + 4ĵ, v = 3î - ĵ", ok: true }
    ]
  },
  {
    id: "T3D19",
    q: "En un hexágono regular centrado en el origen, con un vértice en î, la suma de todos los vectores desde el origen a cada vértice es:",
    opts: [
      { t: "0î + 0ĵ", ok: true },
      { t: "6î", ok: false, fb: "Eso significaría que todos los vértices del hexágono empujan en un solo eje, como si estuvieran alineados, y perdería su forma de polígono regular." },
      { t: "6ĵ", ok: false, fb: "Eso significaría que todos los vértices del hexágono empujan en un solo eje, como si estuvieran alineados, y perdería su forma de polígono regular." },
      { t: "3î + (3√3)ĵ", ok: false, fb: "Parece que sumaste un subconjunto de vectores. La simetría de una figura regular garantiza que por cada vector hay uno opuesto neutralizándolo." }
    ]
  },
  {
    id: "T3D20",
    q: "La resultante de dos fuerzas de magnitudes 10 N y 20 N puede ser:",
    opts: [
      { t: "5 N", ok: false, fb: "Recuerda que la resultante más débil se da cuando los vectores chocan (20 - 10). ¡Cualquier valor menor a 10 es inalcanzable!" },
      { t: "10 N o 25 N (ambas son posibles)", ok: true },
      { t: "Solo 25 N", ok: false, fb: "25 N sí es posible (está entre 10 y 30), pero no es la única: 10 N también lo es si las fuerzas van en sentidos opuestos." },
      { t: "35 N", ok: false, fb: "30 N es el techo máximo si ambos vectores tiran perfectamente unidos. 35 N está fuera de la realidad física del problema." }
    ]
  },
  {
    id: "T3D21",
    q: "En 3 dimensiones, la suma de vectores 2î + 3ĵ - k + (î - 2ĵ + 4k) es:",
    opts: [
      { t: "3î + ĵ - 5k", ok: false, fb: "En lugar de hacer una suma (-1 + 4), terminaste restándolos y hundiendo la coordenada Z en los negativos." },
      { t: "3î + ĵ + 3k", ok: true },
      { t: "3î + 5ĵ + 3k", ok: false, fb: "Ignoraste el signo del -2 al momento de sumar las variables y. Respeta la ley de los signos: 3 + (-2) no es lo mismo que 3 + 2." },
      { t: "î + 5ĵ + 3k", ok: false, fb: "Tuviste problemas con la primera coordenada. Ten cuidado de organizar cada componente de los bloques de manera lineal." }
    ]
  },
  {
    id: "T3D22",
    q: "La resta 5î - 2ĵ + 3k - (2î + ĵ + 4k) en 3D es:",
    opts: [
      { t: "7î - ĵ - k", ok: false, fb: "El signo principal entre paréntesis dicta una resta, pero tú sumaste la coordenada x." },
      { t: "3î - 3ĵ + 7k", ok: false, fb: "Tu despiste ocurrió en el eje z al sumar los valores en vez de restarlos. Es 3 - 4, no 3 + 4." },
      { t: "3î - ĵ - k", ok: false, fb: "En el eje y, calcular -2 - 1 debe hacerte descender más en el mundo de los números negativos. ¡No restes valores absolutos!." },
      { t: "3î - 3ĵ - k", ok: true }
    ]
  },
  {
    id: "T3D23",
    q: "Si u = 2î - ĵ + 3k, v = î + 2ĵ - 2k, entonces 2u - 3v es:",
    opts: [
      { t: "î - 8ĵ + 12k", ok: true },
      { t: "7î - 8ĵ", ok: false, fb: "Fallaste en x y en z al sumar partes de tus componentes escalados en lugar de mantener la sustracción. Además, 6 - (-6) no se anula a 0." },
      { t: "î - 8ĵ", ok: false, fb: "Llegaste limpio a la coordenada z, pero olvidaste aplicar el menos del vector v." },
      { t: "7î + 4ĵ + 12k", ok: false, fb: "Perdiste el hilo con los signos desde el principio. Una estrategia segura es armar un bloque para 2u, otro para 3v, y al final restarlos con calma uno a uno." }
    ]
  },
  {
    id: "T3D24",
    q: "La condición para que tres puntos A, B, C estén alineados es que exista un escalar k tal que:",
    opts: [
      { t: "AB · AC = 0", ok: false, fb: "Este es el test de perpendicularidad (hacer un cruce en \"L\"). No tiene nada que ver con estar en la misma línea de tren." },
      { t: "AB + AC = 0", ok: false, fb: "Eso significaría que el punto medio compensa exactamente todo, lo cual alinea las cosas, pero limita la respuesta a un caso de simetría muy específico. Te falta la noción del \"múltiplo\"." },
      { t: "AB = k·AC", ok: true },
      { t: "|AB| = |AC|", ok: false, fb: "Eso solo indica igualdad de tamaños. Los vectores podrían estar en cualquier ángulo, apuntando a donde sea, y cumplir esto. Necesitas confirmar su proporcionalidad lineal." }
    ]
  },
  {
    id: "T3D25",
    q: "Dados los puntos A(î + 2ĵ + 3k), B(3î + 5ĵ + 7k) y C(5î + 8ĵ + 11k), ¿están alineados?",
    opts: [
      { t: "No, porque las componentes no son proporcionales", ok: false, fb: "¡Sí son proporcionales! Si calculas el vector AB y el BCf, notarás que sus componentes son idénticos, lo que quiere decir que son un múltiplo perfecto del otro." },
      { t: "Sí, porque AB = (2î + 3ĵ + 4k) y BC = (2î + 3ĵ + 4k)", ok: true },
      { t: "Sí, porque AB + BC = AC", ok: false, fb: "Esa es la regla de la suma de vectores que dibuja un triángulo válido. No obstante, no sirve como diagnóstico para confirmar la alineación perfecta de las coordenadas." },
      { t: "No, porque la suma no es cero", ok: false, fb: "Para comprobar la alineación en 3D, no necesitas que el trayecto se cancele o de cero, solo necesitas probar que la ruta de A -> B lleva la misma inclinación exacta que la de B -> C." }
    ]
  }
  ]);
})();
