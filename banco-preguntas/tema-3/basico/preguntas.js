/**
 * Tema 3 · Básico — Suma y resta de vectores (40 preguntas)
 */
(function () {
  "use strict";
  if (typeof quizBankRegistrar !== "function") {
    throw new Error("Carga quiz-bank-loader.js antes de este archivo.");
  }
  quizBankRegistrar("3", "facil", [
  {
    id: "T3F01",
    q: "¿Cuál es el resultado de los vectores 2î + 3ĵ + (î + 4ĵ)?",
    opts: [
      { t: "î + ĵ", ok: false, fb: "Revisa la operación que aplicaste. Esos números indican que quitaste distancia en lugar de agregarla." },
      { t: "2î + 7ĵ", ok: false, fb: "Pareciera que juntaste correctamente el movimiento vertical, pero el horizontal se quedó igual. ¿Qué sucede al combinar las primeras componentes?" },
      { t: "3î + 4ĵ", ok: false, fb: "Vas por buen camino con el eje horizontal, pero olvidaste el vertical. ¿Avanzaste en ambos ejes?" },
      { t: "3î + 7ĵ", ok: true }
    ]
  },
  {
    id: "T3F02",
    q: "0î + 0ĵ + (4î - ĵ) =",
    opts: [
      { t: "4î - ĵ", ok: true },
      { t: "0î + 0ĵ", ok: false, fb: "Piensa en el vector 0î + 0ĵ como estar completamente quieto. Si a ese estado le agregas un movimiento de 4î + ĵ, ¿realmente te quedarías en el mismo lugar?" },
      { t: "-4î + ĵ", ok: false, fb: "Parece que invertiste la dirección del movimiento original. Sumar cero a algo no debería cambiar su sentido hacia el lado opuesto." },
      { t: "4î + ĵ", ok: false, fb: "Cuidado con los signos. Si el vector original indica que debes bajar una unidad (-1), sumar cero no debería hacer que de repente subas." }
    ]
  },
  {
    id: "T3F03",
    q: "3î + 2ĵ + (-3î - 2ĵ) =",
    opts: [
      { t: "6î + 4ĵ", ok: false, fb: "Parece que sumaste como si todos fueran movimientos positivos. ¡Presta atención a hacia dónde apuntan los signos negativos!" },
      { t: "0î + 0ĵ", ok: true },
      { t: "-6î - 4ĵ", ok: false, fb: "Analiza de nuevo los signos de tu primer vector. ¿Eran negativos desde el principio?" },
      { t: "3î + 2ĵ", ok: false, fb: "Este es tu punto de partida. Si le aplicas un movimiento exactamente opuesto, ¿te quedarías ahí mismo?" }
    ]
  },
  {
    id: "T3F04",
    q: "î + 4ĵ + 2î =",
    opts: [
      { t: "2î + 4ĵ", ok: false, fb: "Mezclaste el eje horizontal del segundo vector con el horizontal del primero, pero el resultado... ¿no te parece extraño?" },
      { t: "î + 4ĵ", ok: false, fb: "Parece que ignoraste por completo el segundo movimiento. ¡Ambos cuentan!" },
      { t: "3î + 4ĵ", ok: true },
      { t: "3î", ok: false, fb: "Sumaste muy bien el eje x, pero en las y, el 4 original desapareció. Sumar cero no significa borrar lo que ya tenías." }
    ]
  },
  {
    id: "T3F05",
    q: "5î + 5ĵ + (-5ĵ) =",
    opts: [
      { t: "0î + 0ĵ", ok: false, fb: "Es cierto que el movimiento vertical se cancela, pero ¿qué pasa con el avance horizontal original?" },
      { t: "5î + 10ĵ", ok: false, fb: "Observa el signo del segundo vector. Te pide bajar 5 unidades, no subir otras 5." },
      { t: "5ĵ", ok: false, fb: "Cuidado con cruzar los ejes. Verifica si sumaste el avance horizontal con el horizontal, y el vertical con el vertical." },
      { t: "5î", ok: true }
    ]
  },
  {
    id: "T3F06",
    q: "-2î - 2ĵ + (2î + 2ĵ) =",
    opts: [
      { t: "-4î - 4ĵ", ok: false, fb: "Parece que sumaste todo como si fueran valores negativos. Fíjate en los signos del segundo vector." },
      { t: "0î + 0ĵ", ok: true },
      { t: "4î + 4ĵ", ok: false, fb: "Ignoraste que el primer vector va en retroceso. ¿Qué pasa cuando das dos pasos atrás y luego dos adelante?" },
      { t: "4ĵ", ok: false, fb: "Viste que un eje se neutraliza, pero el otro también sufre exactamente el mismo efecto. Analiza ambas operaciones." }
    ]
  },
  {
    id: "T3F07",
    q: "3î + (3ĵ) =",
    opts: [
      { t: "3î + 3ĵ", ok: true },
      { t: "0î + 0ĵ", ok: false, fb: "Aunque apuntan en ejes distintos, no se están cancelando. Uno avanza en horizontal y el otro en vertical; ambos caminos se combinan." },
      { t: "3î", ok: false, fb: "Te olvidaste del movimiento vertical. ¡Acuérdate de incorporar la segunda parte del trayecto!" },
      { t: "3ĵ", ok: false, fb: "Dejaste atrás el avance horizontal. Revisa si en verdad combinaste ambos vectores." }
    ]
  },
  {
    id: "T3F08",
    q: "î + ĵ + (2î + 2ĵ) + (3î + 3ĵ) =",
    opts: [
      { t: "4î + 4ĵ", ok: false, fb: "Saltaste uno de los vectores en tu cuenta. Todos los pasos se deben sumar en el viaje final." },
      { t: "5î + 5ĵ", ok: false, fb: "Te quedaste a medio camino. Juntaste los primeros dos, pero el tercer vector también quiere participar en la ruta." },
      { t: "6î + 6ĵ", ok: true },
      { t: "7î + 7ĵ", ok: false, fb: "Revisa tu suma básica de 1 + 2 + 3. Te fuiste un poco de largo con los números." }
    ]
  },
  {
    id: "T3F09",
    q: "aî + bî + (cî + dĵ) =",
    opts: [
      { t: "aî + bĵ", ok: false, fb: "Te quedaste solo con el primer elemento. La idea de sumar es combinar ambos." },
      { t: "(a+d)î + (b+c)ĵ", ok: false, fb: "Mezclaste peras con manzanas. Recuerda que los componentes horizontales van juntos, y los verticales con los verticales." },
      { t: "(ac)î + (bd)ĵ", ok: false, fb: "Esa operación se parece más a una multiplicación que a una combinación de trayectos (suma)." },
      { t: "(a+c)î + (b+d)ĵ", ok: true }
    ]
  },
  {
    id: "T3F10",
    q: "La suma de un vector y su opuesto es:",
    opts: [
      { t: "Un vector unitario", ok: false, fb: "Piensa en el resultado de cancelarse mutuamente. ¿Eso daría un vector de tamaño 1 o indicaría total reposo?" },
      { t: "El doble del vector", ok: false, fb: "Si avanzas una distancia y luego retrocedes esa misma distancia, ¿habrás avanzado el doble?" },
      { t: "El mismo vector", ok: false, fb: "Si a tu posición le agregas un movimiento que te empuja exactamente hacia atrás con la misma fuerza, ¿te quedas donde mismo?" },
      { t: "El vector nulo", ok: true }
    ]
  },
  {
    id: "T3F11",
    q: "5î + 4ĵ - (2î + ĵ) =",
    opts: [
      { t: "3î + 3ĵ", ok: true },
      { t: "7î + 5ĵ", ok: false, fb: "Revisa el signo de la operación. Parece que combinaste las distancias sumándolas en lugar de encontrar su diferencia." },
      { t: "3î + 2ĵ", ok: false, fb: "Resolviste muy bien el eje horizontal, pero en el vertical la resta no cuadra. ¿Cuánto es a 4 quitarle 1?" },
      { t: "2î + 3ĵ", ok: false, fb: "Cuidado con el orden. Las restas se hacen componente a componente sin invertirlas ni cruzarlas." }
    ]
  },
  {
    id: "T3F12",
    q: "0î + 0ĵ - (3î + 2ĵ) =",
    opts: [
      { t: "0î + 0ĵ", ok: false, fb: "Restar algo a un punto de reposo altera tu posición. Definitivamente no puedes seguir en cero." },
      { t: "3î + 2ĵ", ok: false, fb: "Si a \"nada\" le quitas un valor positivo, el resultado no puede seguir siendo positivo. ¿Qué signo debería tener?" },
      { t: "-3î - 2ĵ", ok: true },
      { t: "-2î - 3ĵ", ok: false, fb: "Invertiste el orden de los componentes al aplicar el signo negativo." }
    ]
  },
  {
    id: "T3F13",
    q: "4î + 4ĵ - (4î + 4ĵ) =",
    opts: [
      { t: "8î + 8ĵ", ok: false, fb: "La instrucción es restar, no sumar. ¡Ojo con ese signo matemático!" },
      { t: "0î + 0ĵ", ok: true },
      { t: "4î + 4ĵ", ok: false, fb: "Si a una cantidad le quitas exactamente la misma cantidad, ¿te quedas con todo lo que tenías?" },
      { t: "-4î - 4ĵ", ok: false, fb: "Pareciera que hiciste la operación al revés restándole a cero. Recuerda de dónde estás partiendo." }
    ]
  },
  {
    id: "T3F14",
    q: "3î + 5ĵ - 2ĵ =",
    opts: [
      { t: "3î + 3ĵ", ok: true },
      { t: "3î + 7ĵ", ok: false, fb: "En el eje vertical (Y), en lugar de restar la distancia, la sumaste." },
      { t: "3ĵ", ok: false, fb: "Si a 3 le quitas 0, ¿el 3 desaparece? Revisa tu resta en el componente X." },
      { t: "3î + 2ĵ", ok: false, fb: "Tu resta en Y tiene un pequeño desliz aritmético. ¿Cuánto es verdaderamente 5 menos 2?" }
    ]
  },
  {
    id: "T3F15",
    q: "-2î - 2ĵ - (-î - ĵ) =",
    opts: [
      { t: "0î + 0ĵ", ok: false, fb: "No estás restando cantidades iguales, por lo que no pueden anularse por completo." },
      { t: "-3î - 3ĵ", ok: false, fb: "Ojo con la regla de los signos: restar un número negativo equivale a sumarlo. Pareciera que hiciste (-2) + (-1)." },
      { t: "î + ĵ", ok: false, fb: "El número base es más negativo que la porción que estás quitando. El resultado debe mantenerse en la zona negativa." },
      { t: "-î - ĵ", ok: true }
    ]
  },
  {
    id: "T3F16",
    q: "aî + bĵ - (cî + dĵ) =",
    opts: [
      { t: "(ac)î + (bd)ĵ", ok: false, fb: "Esa operación corresponde a multiplicar, no a encontrar una diferencia de distancias." },
      { t: "(a+d)î + (b+c)ĵ", ok: false, fb: "Estás cruzando componentes. Las posiciones horizontales se restan con las horizontales, y las verticales con las verticales." },
      { t: "(a-c)î + (b-d)ĵ", ok: true },
      { t: "aî + bĵ", ok: false, fb: "Te quedaste únicamente con la información del primer vector. ¡Falta aplicar la resta!" }
    ]
  },
  {
    id: "T3F17",
    q: "7î + 3ĵ - (2î + 5ĵ) =",
    opts: [
      { t: "9î + 8ĵ", ok: false, fb: "Aplicaste una suma en lugar de una resta. Lee de nuevo la operación solicitada." },
      { t: "5î + 2ĵ", ok: false, fb: "Resolviste perfecto la X, pero en la Y, si a 3 le quitas 5 (un número mayor), ¿el resultado es positivo?" },
      { t: "5î - 2ĵ", ok: true },
      { t: "-5î + 2ĵ", ok: false, fb: "Parece que restaste el primer vector del segundo. ¡Cuidado con el orden, la resta de vectores no es conmutativa!" }
    ]
  },
  {
    id: "T3F18",
    q: "î + ĵ - (2î + 2ĵ) =",
    opts: [
      { t: "3î + 3ĵ", ok: false, fb: "Sumaste los valores en vez de calcular su diferencia." },
      { t: "-î - ĵ", ok: true },
      { t: "î + ĵ", ok: false, fb: "Este es tu vector de inicio. Si le restas otro movimiento, tu resultado debe cambiar." },
      { t: "0î + 0ĵ", ok: false, fb: "Solo se anularían si el segundo vector fuera idéntico al primero. Aquí le estás restando uno mayor." }
    ]
  },
  {
    id: "T3F19",
    q: "5ĵ - (5î) =",
    opts: [
      { t: "-5î + 5ĵ", ok: true },
      { t: "5î - 5ĵ", ok: false, fb: "Invertiste el orden de la resta. Recuerda: es la componente X del primero menos la del segundo, ¡y respeta sus lugares!" },
      { t: "5î + 5ĵ", ok: false, fb: "Efectuaste una suma en vez de una resta." },
      { t: "0î + 0ĵ", ok: false, fb: "Tienen los mismos números, pero están cruzados en los ejes. No pueden anularse mutuamente de esta manera." }
    ]
  },
  {
    id: "T3F20",
    q: "Restar un vector es lo mismo que:",
    opts: [
      { t: "Sumar su opuesto", ok: false, fb: "Es un excelente razonamiento, ¡pero lee la otra opción! ¿No hay más de una forma correcta de decirlo?" },
      { t: "Multiplicar por -1 y sumar", ok: false, fb: "Tienes mucha razón, pero verifica la primera alternativa. ¿Acaso no significan lo mismo en la práctica?" },
      { t: "Ambas son correctas", ok: true },
      { t: "Ninguna es correcta", ok: false, fb: "Piénsalo bien. Transformar una resta en una suma cambiando el signo es una propiedad geométrica válida. Ambas alternativas de arriba lo explican." }
    ]
  },
  {
    id: "T3F21",
    q: "Geométricamente, la suma de dos vectores se representa con:",
    opts: [
      { t: "La altura del triángulo", ok: false, fb: "La altura es una medida estática en una figura, pero ¿representa el trayecto resultante de combinar dos direcciones?" },
      { t: "La diagonal del paralelogramo", ok: true },
      { t: "El área del rectángulo", ok: false, fb: "El área nos da una superficie (un escalar). ¿Cómo nos diría eso hacia dónde debemos apuntar el nuevo camino?" },
      { t: "La pendiente de la recta", ok: false, fb: "La pendiente habla de la inclinación de una sola línea, no nos dice la combinación de dos trayectos completos." }
    ]
  },
  {
    id: "T3F22",
    q: "Si colocas dos vectores \"punta con cola\", el resultado es:",
    opts: [
      { t: "El vector resultante de la suma", ok: true },
      { t: "El vector opuesto", ok: false, fb: "Ponerlos uno tras otro suma sus caminos para crear uno nuevo. Para obtener un opuesto, tendrías que invertir su dirección." },
      { t: "Un punto", ok: false, fb: "Si unes desplazamientos, el trayecto final desde el inicio hasta el fin sigue siendo una flecha, no un solo lugar fijo en el espacio." },
      { t: "Un escalar", ok: false, fb: "Trazar un camino continuo te da una nueva dirección y distancia, un escalar solo te daría la distancia a secas." }
    ]
  },
  {
    id: "T3F23",
    q: "u - v geométricamente es:",
    opts: [
      { t: "La suma de ambos", ok: false, fb: "La suma completaría la diagonal de un paralelogramo desde el origen, no conectaría las puntas directamente entre sí." },
      { t: "El vector que va de u a v", ok: false, fb: "¡Cuidado con la dirección geométrica! Ir de u a v es en realidad v - u. Recuerda cómo calculas una diferencia: Final menos Inicial." },
      { t: "El vector que va de v a u", ok: true },
      { t: "El opuesto de u", ok: false, fb: "El opuesto sería apuntar la flecha de u hacia el lado contrario, sin siquiera involucrar al vector v." }
    ]
  },
  {
    id: "T3F24",
    q: "Si u = 3î + 4ĵ y v = î + 2ĵ, entonces u - v es:",
    opts: [
      { t: "4î + 2ĵ", ok: false, fb: "Sumaste las X y restaste las Y. Revisa tu consistencia matemática." },
      { t: "4î + 6ĵ", ok: false, fb: "Parece que aplicaste una suma. El ejercicio te pide explícitamente la diferencia de posiciones." },
      { t: "2î + 6ĵ", ok: false, fb: "Restaste bien la primera parte, pero sumaste la segunda. La operación debe mantenerse en ambas." },
      { t: "2î + 2ĵ", ok: true }
    ]
  },
  {
    id: "T3F25",
    q: "La magnitud de u - v puede ser cero si:",
    opts: [
      { t: "u = -v", ok: false, fb: "Si restas un opuesto, es como sumar el mismo vector dos veces. Eso te haría avanzar el doble, no quedarte en cero." },
      { t: "u = v", ok: true },
      { t: "u y v son perpendiculares", ok: false, fb: "Imagina dos caminos en forma de ángulo de 90°. La distancia que los conecta formaría una hipotenusa, que jamás valdrá cero." },
      { t: "u es nulo", ok: false, fb: "Si a \"nada\" le quitas un vector, te quedas con la versión negativa de ese vector, que sigue teniendo una longitud." }
    ]
  },
  {
    id: "T3F26",
    q: "5î + 5ĵ - (3î + 3ĵ) =",
    opts: [
      { t: "2î", ok: false, fb: "Restaste bien la X, pero en la Y... ¿si tienes 5 y te quitan 3, en serio te quedas en 0?" },
      { t: "8î + 8ĵ", ok: false, fb: "Observa el signo de operación. ¡Añadiste los valores en lugar de quitarlos!" },
      { t: "2î + 2ĵ", ok: true },
      { t: "2ĵ", ok: false, fb: "Resolviste bien la Y, pero tu cálculo en la X es erróneo. Revisa cuánto es verdaderamente 5 menos 3." }
    ]
  },
  {
    id: "T3F27",
    q: "Si u - v = 0î + 0ĵ, entonces:",
    opts: [
      { t: "u = v", ok: true },
      { t: "u = -v", ok: false, fb: "Si le restas su versión opuesta, estarías duplicando su magnitud. Solo daría cero si de por sí no valieran nada." },
      { t: "u y v son opuestos", ok: false, fb: "Ser opuestos significa que uno es el negativo del otro. Al restarlos, el efecto de separación se agiganta." },
      { t: "u es nulo", ok: false, fb: "Si \"u\" es cero y le quitas \"v\", te quedas con \"-v\". Eso no te garantiza llegar a cero a menos que \"v\" también no valga nada." }
    ]
  },
  {
    id: "T3F28",
    q: "La resta de vectores no es conmutativa porque:",
    opts: [
      { t: "No tiene sentido", ok: false, fb: "Sí tiene sentido, de hecho, es una operación vital en física y geometría para encontrar el trayecto entre dos ubicaciones." },
      { t: "u - v = v - u", ok: false, fb: "Decir que son iguales es justamente la definición de conmutatividad. ¡Y el problema dice que NO lo es!" },
      { t: "Siempre da cero", ok: false, fb: "La única forma de que dé siempre cero es que restes copias idénticas todo el tiempo." },
      { t: "u - v ≠ v - u", ok: true }
    ]
  },
  {
    id: "T3F29",
    q: "2î + 3ĵ - (4î + ĵ) =",
    opts: [
      { t: "-2î + 2ĵ", ok: true },
      { t: "2î + 2ĵ", ok: false, fb: "En el eje horizontal: si tienes 2 y quieres quitarle un número más grande como 4, el resultado debería adentrarse en los números negativos." },
      { t: "-2î - 2ĵ", ok: false, fb: "Resolviste bien el signo negativo del primer componente, pero para el segundo: a 3 quítale 1, ¿por qué habría de quedar negativo?" },
      { t: "6î + 4ĵ", ok: false, fb: "Combinaste ambos vectores como suma en lugar de encontrar su diferencia." }
    ]
  },
  {
    id: "T3F30",
    q: "u - v = w, entonces u =",
    opts: [
      { t: "w - v", ok: false, fb: "Si despejas una ecuación algebraica normal como X - Y = Z para dejar a la X sola, ¿pasarías la Y restando al otro lado?" },
      { t: "w + v", ok: true },
      { t: "v - w", ok: false, fb: "Observa de qué lado del igual está la variable que quieres aislar. Cruzaste los términos de manera incorrecta." },
      { t: "w × v", ok: false, fb: "Una resta nunca se convierte mágicamente en una multiplicación vectorial al despejarla de lado." }
    ]
  },
  {
    id: "T3F31",
    q: "TecDuck está en el punto 2î + 3ĵ y se mueve según el vector 4î + ĵ. ¿En qué punto termina?",
    opts: [
      { t: "6î + 3ĵ", ok: false, fb: "Contabilizaste su avance horizontal, pero su altura original se quedó sin la actualización de su vuelo." },
      { t: "2î + 4ĵ", ok: false, fb: "Calculaste su nueva altura, pero parece que olvidaste que el pato también avanzó hacia los lados. ¡La coordenada X también sufre un cambio!" },
      { t: "6î + 4ĵ", ok: true },
      { t: "4î + ĵ", ok: false, fb: "Te quedaste únicamente con la instrucción del desplazamiento. ¡Esa es la distancia que voló, no su coordenada de destino final!" }
    ]
  },
  {
    id: "T3F32",
    q: "TecDuck está en 5î + 2ĵ y quiere ir a î + 5ĵ. ¿Qué vector debe seguir?",
    opts: [
      { t: "6î + 7ĵ", ok: false, fb: "Sumaste tu posición actual con tu meta. ¡Ese vuelo lo alejaría completamente del objetivo!" },
      { t: "4î - 3ĵ", ok: false, fb: "Ese es el vector que TecDuck tomaría para hacer el viaje de regreso a casa. Recuerda cómo hallar un desplazamiento: Destino menos Inicio." },
      { t: "-4î - 3ĵ", ok: false, fb: "Acertaste en la coordenada X, pero en la Y... si estás en el piso 2 y subes al 5, ¿por qué tu viaje sería negativo?" },
      { t: "-4î + 3ĵ", ok: true }
    ]
  },
  {
    id: "T3F33",
    q: "Si la posición final de TecDuck es 7î + 3ĵ y el desplazamiento fue 2î + 5ĵ, ¿cuál era la posición inicial?",
    opts: [
      { t: "9î + 8ĵ", ok: false, fb: "Sumaste el desplazamiento a tu punto de llegada, lo que te daría tu siguiente parada. Debes hacer la operación inversa para averiguar de dónde viniste." },
      { t: "5î - 2ĵ", ok: true },
      { t: "5î + 2ĵ", ok: false, fb: "Lograste retroceder bien en X, pero en Y, si llegaste a 3 después de haber subido 5, significa que empezaste... ¿más abajo o más arriba? Revisa tu resta (3 - 5)." },
      { t: "7î + 3ĵ", ok: false, fb: "Usaste la ubicación a la que llegaste. Queremos averiguar dónde estaba nuestro personaje antes de despegar." }
    ]
  },
  {
    id: "T3F34",
    q: "TecDuck vuela de A a B con vector 3î + 4ĵ. Luego vuela de B a C con vector 2î - ĵ. Si A = î + ĵ, ¿cuál es C?",
    opts: [
      { t: "5î + 3ĵ", ok: false, fb: "Tu cálculo combinó las \"X\" de manera imprecisa y restó mal las \"Y\". Intenta hacerlo visualizando parada por parada." },
      { t: "3î + 3ĵ", ok: false, fb: "Parece que combinaste las distancias de los dos vuelos, pero te faltó sumarle el punto de partida a todo ese trayecto acumulado." },
      { t: "6î + 4ĵ", ok: true },
      { t: "4î + 5ĵ", ok: false, fb: "Encontraste la parada intermedia (el punto B), ¡pero a TecDuck todavía le falta un último empujón para llegar a C!" }
    ]
  },
  {
    id: "T3F35",
    q: "La diferencia entre los puntos 8î + 3ĵ y 2î + 5ĵ es:",
    opts: [
      { t: "6î - 2ĵ", ok: true },
      { t: "6î + 2ĵ", ok: false, fb: "Calculaste la diferencia en X, pero tu operación en Y asume equivocadamente el orden. Si a 3 le quitas 5, caes en números negativos." },
      { t: "-6î + 2ĵ", ok: false, fb: "Revisemos el eje horizontal. Si partes del número 8 y le restas 2, tu resultado debería ser positivo, no negativo." },
      { t: "-6î - 2ĵ", ok: false, fb: "Parece que formulaste la resta completamente al revés en ambos componentes." }
    ]
  },
  {
    id: "T3F36",
    q: "Si u + v = 5î + 2ĵ y u = 3î + ĵ, entonces v =",
    opts: [
      { t: "î + 2ĵ", ok: false, fb: "Tienes los números correctos, pero intercambiados. En vectores no puedes cruzar las coordenadas." },
      { t: "8î + 3ĵ", ok: false, fb: "Sumaste \"u\" al resultado total. Piensa en álgebra básica: para encontrar una parte faltante cuando conoces el total, debes restar, no sumar más." },
      { t: "2î + 3ĵ", ok: false, fb: "Hallaste bien la diferencia en el eje X, pero en el Y, si al total de 2 le quitas 1, ¿en serio te sobran 3?" },
      { t: "2î + ĵ", ok: true }
    ]
  },
  {
    id: "T3F37",
    q: "Si u - v = 4î - ĵ y v = 2î + 3ĵ, entonces u =",
    opts: [
      { t: "2î - 4ĵ", ok: false, fb: "Si ya tienes el resultado de la diferencia, tienes que \"devolverle\" el valor restado usando una suma. ¡Aquí lo volviste a restar!" },
      { t: "6î + 2ĵ", ok: true },
      { t: "6î - 4ĵ", ok: false, fb: "Recuperaste perfecto el eje horizontal, pero en el vertical: si combinas -1 con 3, ¿el número baja hasta -4 o sube?" },
      { t: "2î + 2ĵ", ok: false, fb: "Esos valores no cuadran con la operación. Plantea tu lógica: ¿Qué número inicial menos 2 te daría como resultado 4?" }
    ]
  },
  {
    id: "T3F38",
    q: "La suma de los vectores 2î + ĵ, 3î + 4ĵ y -5î - 5ĵ es:",
    opts: [
      { t: "0î + 0ĵ", ok: true },
      { t: "10î + 10ĵ", ok: false, fb: "Ignoraste por completo que el último vector representaba distancias negativas y sumaste todo como si fuera positivo. ¡El sentido importa!" },
      { t: "10ĵ", ok: false, fb: "Resolviste perfecto el primer componente, pero en el segundo, sumar 1 + 4 y luego quitar 5, jamás dará 10." },
      { t: "10î", ok: false, fb: "Lograste hacer que las Y volvieran a su lugar de origen, pero te fallaron las matemáticas de las X. 2 + 3 - 5 tampoco suma 10." }
    ]
  },
  {
    id: "T3F39",
    q: "Un vector tiene componentes (x, y). Si se le suma 2î - 3ĵ y se obtiene 5î + ĵ, el vector original es:",
    opts: [
      { t: "3î - 2ĵ", ok: false, fb: "Hiciste el despeje perfecto en X, pero al mover el -3 de la coordenada Y al otro lado del signo de igual, recuerda que su operación debe cambiar a lo opuesto (suma)." },
      { t: "7î - 2ĵ", ok: false, fb: "En lugar de despejar tu ecuación restando el vector que se había añadido, decidiste sumar todo junto. ¡Usa la operación inversa!" },
      { t: "3î + 4ĵ", ok: true },
      { t: "7î + 4ĵ", ok: false, fb: "Cuidado con tu despeje de variables. Si el 2 del vector estaba sumando, pasa al otro lado restando." }
    ]
  },
  {
    id: "T3F40",
    q: "Si a un vector se le resta -î + 2ĵ y se obtiene 4î - 3ĵ, el vector original es:",
    opts: [
      { t: "5î - ĵ", ok: false, fb: "Te equivocaste despejando los signos de la X. Si el -1 original estaba siendo restado, al despejar pasa sumando, pero sigue siendo un número negativo: 4 + (-1)." },
      { t: "5î - 5ĵ", ok: false, fb: "Lo que hiciste fue aplicar una resta extra sobre tu resultado final. Para deshacer una resta y volver al pasado, debes hacer una suma." },
      { t: "3î - 5ĵ", ok: false, fb: "Deshiciste muy bien el camino de la X, pero en la Y: si tenías -3 y pasas sumando ese 2, subes un poco a -1, no bajas todavía más a -5." },
      { t: "3î - ĵ", ok: true }
    ]
  }
  ]);
})();
