/**
 * Tema 4 · Básico — Multiplicación por escalar (40 preguntas)
 */
(function () {
  "use strict";
  if (typeof quizBankRegistrar !== "function") {
    throw new Error("Carga quiz-bank-loader.js antes de este archivo.");
  }
  quizBankRegistrar("4", "facil", [
  {
    id: "T4F01",
    q: "Si multiplicas el vector 2î + 3ĵ por el escalar 2, ¿cuál es el resultado?",
    opts: [
      { t: "4î + 3ĵ", ok: false, fb: "Parece que solo multiplicaste la componente horizontal (x). El escalar afecta a todo el vector." },
      { t: "4î + 6ĵ", ok: true },
      { t: "2î + 6ĵ", ok: false, fb: "Multiplicaste correctamente la componente vertical, pero el avance horizontal se quedó igual." },
      { t: "4î + 5ĵ", ok: false, fb: "Aquí sumaste el escalar (2+2)î + (3+2)ĵ en lugar de multiplicarlo." }
    ]
  },
  {
    id: "T4F02",
    q: "Calcula 3 * (î + 4ĵ):",
    opts: [
      { t: "3î + 4ĵ", ok: false, fb: "Olvidaste multiplicar la segunda componente por 3." },
      { t: "4î + 7ĵ", ok: false, fb: "Realizaste una suma (1+3)î + (4+3)ĵ. Recuerda que el escalar amplifica multiplicando." },
      { t: "3î + 12ĵ", ok: true },
      { t: "12î + 3ĵ", ok: false, fb: "Recuerda el orden de las componentes (x, y). Primero va el eje horizontal (x) y luego el vertical (y). Las has invertido." }
    ]
  },
  {
    id: "T4F03",
    q: "¿Cuál es el resultado de 4 * (0î + 2ĵ)?",
    opts: [
      { t: "4î + 8ĵ", ok: false, fb: "Si multiplicas 4 por 0, el resultado no es 4. Todo número multiplicado por cero da cero." },
      { t: "0î + 8ĵ", ok: true },
      { t: "0î + 6ĵ", ok: false, fb: "Parece que sumaste 4 + 2 en el eje vertical en vez de multiplicar 4 * 2." },
      { t: "4î + 2ĵ", ok: false, fb: "Aquí cambiaste el cero por un 4, pero no multiplicaste la componente vertical." }
    ]
  },
  {
    id: "T4F04",
    q: "Calcula 5 * (2î + 0ĵ):",
    opts: [
      { t: "10î + 0ĵ", ok: true },
      { t: "10î + 5ĵ", ok: false, fb: "Multiplicaste bien el primer número, pero sumaste 5 al segundo. 5 * 0 sigue siendo 0." },
      { t: "7î + 0ĵ", ok: false, fb: "Hiciste una suma (2+5) en el eje horizontal. La operación es multiplicación." },
      { t: "0î + 10ĵ", ok: false, fb: "Recuerda el orden de las componentes (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F05",
    q: "Si TecDuck tiene un vector de velocidad 4î + 4ĵ y activa un turbo que multiplica su velocidad por 2, ¿cuál es su nuevo vector?",
    opts: [
      { t: "6î + 6ĵ", ok: false, fb: "Sumaste 2 a cada componente. El turbo multiplica, no suma." },
      { t: "8î + 4ĵ", ok: false, fb: "Solo duplicaste el avance horizontal (x), olvidando el vertical." },
      { t: "4î + 8ĵ", ok: false, fb: "Solo duplicaste el avance vertical (y). El escalar se aplica a ambas partes." },
      { t: "8î + 8ĵ", ok: true }
    ]
  },
  {
    id: "T4F06",
    q: "¿Cuál es el resultado de 3 * (-î + 2ĵ)?",
    opts: [
      { t: "-3î + 6ĵ", ok: true },
      { t: "3î + 6ĵ", ok: false, fb: "Ignoraste el signo negativo original. Multiplicar un positivo por un negativo da negativo." },
      { t: "-î + 6ĵ", ok: false, fb: "Te faltó multiplicar la componente horizontal por el escalar 3." },
      { t: "-3î + 2ĵ", ok: false, fb: "Multiplicaste bien el eje X, pero olvidaste hacer lo mismo con el eje Y." }
    ]
  },
  {
    id: "T4F07",
    q: "Calcula 2 * (3î - 2ĵ):",
    opts: [
      { t: "6î - 2ĵ", ok: false, fb: "Solo aplicaste la multiplicación a la primera componente." },
      { t: "6î - 4ĵ", ok: true },
      { t: "5î + 0ĵ", ok: false, fb: "Realizaste una suma (3+2)î + (-2+2)ĵ. Debes usar multiplicación." },
      { t: "6î + 4ĵ", ok: false, fb: "Multiplicaste bien los números, pero cambiaste el signo negativo de la Y a positivo." }
    ]
  },
  {
    id: "T4F08",
    q: "Si multiplicas el vector -2î - ĵ por 4, obtienes:",
    opts: [
      { t: "-8î - ĵ", ok: false, fb: "Olvidaste multiplicar la componente vertical por 4." },
      { t: "-6î - 5ĵ", ok: false, fb: "En lugar de multiplicar, restaste 4 a cada componente." },
      { t: "-8î - 4ĵ", ok: true },
      { t: "8î + 4ĵ", ok: false, fb: "Perdiste los signos negativos originales. Positivo por negativo da negativo." }
    ]
  },
  {
    id: "T4F09",
    q: "Calcula 10 * (-î + 0ĵ):",
    opts: [
      { t: "-10î + 10ĵ", ok: false, fb: "Multiplicaste el 0 por 10 y te dio 10. Recuerda que cualquier número por 0 es 0." },
      { t: "-î + 0ĵ", ok: false, fb: "Este es el vector original. ¡Te faltó aplicarle la multiplicación!" },
      { t: "-10î + 0ĵ", ok: true },
      { t: "0î - 10ĵ", ok: false, fb: "Recuerda el orden de las componentes (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F10",
    q: "El resultado de 5 * (0î - 3ĵ) es:",
    opts: [
      { t: "0î - 15ĵ", ok: true },
      { t: "5î - 15ĵ", ok: false, fb: "En la primera componente sumaste el escalar en vez de multiplicarlo por 0." },
      { t: "0î - 8ĵ", ok: false, fb: "En la componente Y aplicaste una resta -3ĵ – 5 en lugar de multiplicar." },
      { t: "-15î + 0ĵ", ok: false, fb: "Recuerda el orden de las componentes (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F11",
    q: "¿Qué sucede si multiplicas el vector 5î + 7ĵ por 0?",
    opts: [
      { t: "5î + 7ĵ", ok: false, fb: "Eso pasaría si multiplicaras por 1." },
      { t: "0î + 0ĵ", ok: true },
      { t: "0î + 7ĵ", ok: false, fb: "Solo multiplicaste la X por cero. El escalar afecta a ambos." },
      { t: "5î + 0ĵ", ok: false, fb: "Solo anulaste la Y. Recuerda que ambas componentes deben multiplicarse por 0." }
    ]
  },
  {
    id: "T4F12",
    q: "Calcula 1 * (8î - 2ĵ):",
    opts: [
      { t: "9î - ĵ", ok: false, fb: "Sumaste 1 a las componentes en vez de multiplicar." },
      { t: "8î - 2ĵ", ok: true },
      { t: "î + ĵ", ok: false, fb: "Reemplazaste las componentes por el escalar." },
      { t: "-8î + 2ĵ", ok: false, fb: "Invertiste los signos. Eso ocurriría si multiplicaras por -1, no por 1." }
    ]
  },
  {
    id: "T4F13",
    q: "¿Cuál es el resultado de -1 * (3î + 4ĵ)?",
    opts: [
      { t: "3î + 4ĵ", ok: false, fb: "Este es el mismo vector original. Multiplicar por -1 debe invertir la dirección." },
      { t: "-3î + 4ĵ", ok: false, fb: "Solo cambiaste el signo de la componente X. El escalar aplica a ambas." },
      { t: "-3î - 4ĵ", ok: true },
      { t: "-4î - 3ĵ", ok: false, fb: "Recuerda el orden de las componentes (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F14",
    q: "Calcula -2 * (î + 2ĵ):",
    opts: [
      { t: "-2î - 4ĵ", ok: true },
      { t: "2î + 4ĵ", ok: false, fb: "Multiplicaste por 2 positivo en vez de -2." },
      { t: "-2î + 2ĵ", ok: false, fb: "Olvidaste multiplicar la componente vertical por el escalar." },
      { t: "-î + 0ĵ", ok: false, fb: "Aquí realizaste una resta (1-2)î + (2-2)ĵ en lugar de una multiplicación." }
    ]
  },
  {
    id: "T4F15",
    q: "Si multiplicas -3 * (-2î + ĵ), obtienes:",
    opts: [
      { t: "-6î - 3ĵ", ok: false, fb: "Menos por menos da más. La primera componente debe ser positiva." },
      { t: "6î - 3ĵ", ok: true },
      { t: "6î + 3ĵ", ok: false, fb: "Menos por más da menos. La segunda componente debe ser negativa." },
      { t: "-5î - 2ĵ", ok: false, fb: "Sumaste el escalar a las componentes (-2-3)î + (1-3)ĵ. ¡Debes multiplicar!" }
    ]
  },
  {
    id: "T4F16",
    q: "Calcula -1 * (-4î - 4ĵ):",
    opts: [
      { t: "-4î - 4ĵ", ok: false, fb: "El vector se quedó igual. Al multiplicar por un negativo, los signos deben cambiar." },
      { t: "0î + 0ĵ", ok: false, fb: "Multiplicar por -1 invierte el vector, no lo anula." },
      { t: "4î + 4ĵ", ok: true },
      { t: "-5î - 5ĵ", ok: false, fb: "Realizaste una resta sumando -1 a cada número en vez de multiplicarlos." }
    ]
  },
  {
    id: "T4F17",
    q: "¿Cuál es el resultado de -4 * (0î + 2ĵ)?",
    opts: [
      { t: "0î - 8ĵ", ok: true },
      { t: "-4î - 8ĵ", ok: false, fb: "Multiplicaste -4 por 0 y te dio -4. ¡Recuerda que da 0!" },
      { t: "0î + 8ĵ", ok: false, fb: "Ignoraste el signo negativo del escalar. El resultado en Y debe ser negativo." },
      { t: "0î - 6ĵ", ok: false, fb: "Restaste en lugar de multiplicar en la componente vertical." }
    ]
  },
  {
    id: "T4F18",
    q: "Calcula -2 * (-3î + 0ĵ):",
    opts: [
      { t: "-6î + 0ĵ", ok: false, fb: "Menos por menos da más. El 6 debe ser positivo." },
      { t: "6î - 2ĵ", ok: false, fb: "Multiplicar 0 por -2 da 0, no -2." },
      { t: "6î + 0ĵ", ok: true },
      { t: "0î + 6ĵ", ok: false, fb: "Recuerda el orden de las componentes (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F19",
    q: "Un vector u = xî + yĵ multiplicado por un escalar negativo siempre:",
    opts: [
      { t: "Mantiene su misma dirección y sentido.", ok: false, fb: "Eso ocurre solo si el escalar es positivo." },
      { t: "Apunta en sentido exactamente opuesto.", ok: true },
      { t: "Se vuelve cero.", ok: false, fb: "Eso solo ocurre si el escalar es exactamente 0." },
      { t: "Gira 90 grados.", ok: false, fb: "Multiplicar por un escalar no rota el vector 90 grados, simplemente lo alarga, lo encoge o lo invierte en la misma línea." }
    ]
  },
  {
    id: "T4F20",
    q: "Si TecDuck vuela en dirección 2î + 3ĵ y el viento lo empuja con un vector -1 * (2î + 3ĵ), el viento lo está llevando hacia:",
    opts: [
      { t: "Atrás (sentido opuesto a su vuelo).", ok: true },
      { t: "Adelante (el mismo sentido).", ok: false, fb: "Para que vaya en el mismo sentido, el escalar tendría que ser positivo." },
      { t: "Un lado (perpendicular).", ok: false, fb: "Un escalar solo cambia la longitud o invierte el sentido sobre la misma línea, no lo desvía hacia los lados." },
      { t: "No lo mueve.", ok: false, fb: "El vector resultante es -2î - 3ĵ, por lo que sí hay un movimiento real." }
    ]
  },
  {
    id: "T4F21",
    q: "Calcula (1/2) * (4î + 6ĵ):",
    opts: [
      { t: "2î + 6ĵ", ok: false, fb: "Solo dividiste la primera componente a la mitad." },
      { t: "4î + 3ĵ", ok: false, fb: "Solo dividiste la segunda componente a la mitad." },
      { t: "2î + 3ĵ", ok: true },
      { t: "8î + 12ĵ", ok: false, fb: "Aquí multiplicaste por 2 en lugar de multiplicar por 1/2 (que es lo mismo que dividir entre 2)." }
    ]
  },
  {
    id: "T4F22",
    q: "¿Cuál es el resultado de (1/3) * (9î + 3ĵ)?",
    opts: [
      { t: "3î + ĵ", ok: true },
      { t: "27î + 9ĵ", ok: false, fb: "Multiplicaste por 3 en lugar de dividir entre 3." },
      { t: "3î + 3ĵ", ok: false, fb: "Olvidaste dividir la componente Y." },
      { t: "î + 3ĵ", ok: false, fb: "Recuerda el orden de las componentes (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F23",
    q: "Calcula (1/2) * (-2î + 8ĵ):",
    opts: [
      { t: "-î + 8ĵ", ok: false, fb: "El escalar 1/2 debe aplicarse también a la componente vertical." },
      { t: "-2î + 4ĵ", ok: false, fb: "Olvidaste aplicar el escalar a la componente horizontal." },
      { t: "î - 4ĵ", ok: false, fb: "Invertiste los signos. El escalar 1/2 es positivo, así que los signos originales se mantienen." },
      { t: "-î + 4ĵ", ok: true }
    ]
  },
  {
    id: "T4F24",
    q: "¿Qué efecto tiene multiplicar un vector por el escalar 1/2?",
    opts: [
      { t: "Duplica su longitud.", ok: false, fb: "Eso sucedería si multiplicaras por 2, no por una fracción menor a 1." },
      { t: "Reduce su longitud a la mitad.", ok: true },
      { t: "Cambia su sentido.", ok: false, fb: "Para cambiar el sentido, el escalar tendría que ser un número negativo." },
      { t: "Lo vuelve nulo.", ok: false, fb: "Solo se volvería nulo si lo multiplicas por 0." }
    ]
  },
  {
    id: "T4F25",
    q: "Calcula -(1/2) * (6î - 4ĵ):",
    opts: [
      { t: "3î - 2ĵ", ok: false, fb: "Dividiste a la mitad correctamente, pero olvidaste que el escalar es negativo y cambia los signos." },
      { t: "-3î - 2ĵ", ok: false, fb: "En la componente Y, menos por menos da más. ¡Cuidado con el signo!" },
      { t: "-3î + 2ĵ", ok: true },
      { t: "3î + 2ĵ", ok: false, fb: "En la componente X, un positivo por un negativo debe dar negativo." }
    ]
  },
  {
    id: "T4F26",
    q: "Si multiplicas un vector por 3, su magnitud (distancia):",
    opts: [
      { t: "Se reduce a una tercera parte.", ok: false, fb: "Eso ocurriría si multiplicaras por la fracción 1/3." },
      { t: "Se triplica.", ok: true },
      { t: "Se queda igual.", ok: false, fb: "El escalar 3 es mayor que 1, por lo que el tamaño del vector forzosamente debe cambiar." },
      { t: "Se suma 3.", ok: false, fb: "En los vectores, el escalar amplifica multiplicando, no funciona como una suma de distancias." }
    ]
  },
  {
    id: "T4F27",
    q: "¿Es el vector 2 * (î + 5ĵ) paralelo al vector î + 5ĵ?",
    opts: [
      { t: "No, porque son perpendiculares.", ok: false, fb: "Multiplicar por un escalar nunca gira el vector 90 grados." },
      { t: "Sí, tienen la misma dirección (paralelos).", ok: true },
      { t: "No, porque se cruzan.", ok: false, fb: "Un vector escalarmente múltiple de otro siempre yace sobre la misma línea o una paralela; jamás se cruzan." },
      { t: "No se puede saber.", ok: false, fb: "La teoría de vectores establece que todo múltiplo escalar produce un vector paralelo al original." }
    ]
  },
  {
    id: "T4F28",
    q: "¿El vector -3 * (2î + 2ĵ) es paralelo a 2î + 2ĵ?",
    opts: [
      { t: "Sí, pero apunta en sentido opuesto.", ok: true },
      { t: "No, el signo negativo rompe el paralelismo.", ok: false, fb: "El paralelismo se refiere a la inclinación de la línea. El signo solo indica si vas hacia adelante o hacia atrás en esa misma línea." },
      { t: "No, se vuelve perpendicular.", ok: false, fb: "Un escalar negativo invierte el sentido, pero no rota el vector para hacerlo perpendicular." },
      { t: "Sí, y apunta en el mismo sentido.", ok: false, fb: "Como el escalar es negativo, es imposible que apunten hacia el mismo lado." }
    ]
  },
  {
    id: "T4F29",
    q: "¿Cuál de los siguientes es el resultado de un escalar k multiplicado por el vector aî + bĵ?",
    opts: [
      { t: "(k+a)î + (k+b)ĵ", ok: false, fb: "El escalar no se suma a las componentes, se multiplica por ellas." },
      { t: "(ka)î + bĵ", ok: false, fb: "Te faltó aplicar el escalar \"k\" a la componente vertical \"b\"." },
      { t: "(ka)î + (kb)ĵ", ok: true },
      { t: "(kb)î + (ka)ĵ", ok: false, fb: "Recuerda el orden de las componentes (x, y). Has multiplicado cruzado invirtiendo los ejes." }
    ]
  },
  {
    id: "T4F30",
    q: "Si k = 0 y el vector es 100î - 50ĵ, el resultado de k * (100î - 50ĵ) es:",
    opts: [
      { t: "100î - 50ĵ", ok: false, fb: "Multiplicar por cero anula el vector, no lo deja intacto." },
      { t: "0î + 0ĵ", ok: true },
      { t: "î + ĵ", ok: false, fb: "Cero por cualquier número da cero, no da uno." },
      { t: "1000î - 500ĵ", ok: false, fb: "Multiplicaste por 10 en lugar de multiplicar por 0." }
    ]
  },
  {
    id: "T4F31",
    q: "TecDuck avanza con un vector 2î + ĵ. Si repite exactamente este mismo movimiento 3 veces seguidas, ¿cuál es su desplazamiento total?",
    opts: [
      { t: "5î + 4ĵ", ok: false, fb: "Parece que sumaste 3 a cada número en vez de multiplicarlos por 3." },
      { t: "2î + 3ĵ", ok: false, fb: "Solo multiplicaste el movimiento vertical (y)." },
      { t: "6î + 3ĵ", ok: true },
      { t: "6î + ĵ", ok: false, fb: "Solo multiplicaste el avance horizontal (x), olvidando que también subió 3 veces." }
    ]
  },
  {
    id: "T4F32",
    q: "El viento empuja a TecDuck con un vector î - 2ĵ. Si una ráfaga llega con el doble de fuerza, ¿qué vector representa la ráfaga?",
    opts: [
      { t: "3î + 0ĵ", ok: false, fb: "Sumaste 2 a cada componente en vez de multiplicar." },
      { t: "2î - 4ĵ", ok: true },
      { t: "2î - 2ĵ", ok: false, fb: "Olvidaste multiplicar la componente Y por el doble." },
      { t: "-2î + 4ĵ", ok: false, fb: "Invertiste los signos. El \"doble\" es un escalar positivo (2), por lo que el sentido no cambia." }
    ]
  },
  {
    id: "T4F33",
    q: "TecDuck quiere retroceder sobre un camino descrito por el vector -3î + 2ĵ recorriendo exactamente la misma distancia. ¿Qué vector debe usar?",
    opts: [
      { t: "3î - 2ĵ", ok: true },
      { t: "-3î - 2ĵ", ok: false, fb: "Solo le cambiaste el signo a la componente vertical. Para retroceder, ambas deben invertirse." },
      { t: "3î + 2ĵ", ok: false, fb: "Cambiaste el signo a la primera pero no a la segunda." },
      { t: "2î - 3ĵ", ok: false, fb: "Recuerda el orden de las componentes (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F34",
    q: "Un cohete viaja en la trayectoria 4î + 8ĵ. Si solo quiere recorrer la mitad del camino con la misma dirección, ¿cuál es su vector?",
    opts: [
      { t: "4î + 4ĵ", ok: false, fb: "Redujiste a la mitad la Y, pero la X se quedó igual." },
      { t: "2î + 4ĵ", ok: true },
      { t: "2î + 8ĵ", ok: false, fb: "Redujiste la X, pero olvidaste hacer lo mismo con la altura." },
      { t: "8î + 16ĵ", ok: false, fb: "Multiplicaste por 2 en lugar de dividir entre 2 (o multiplicar por 1/2)." }
    ]
  },
  {
    id: "T4F35",
    q: "Si k * (2î + 3ĵ) = 6î + 9ĵ, ¿cuál es el valor del escalar k?",
    opts: [
      { t: "2", ok: false, fb: "Si k fuera 2, el resultado sería 4î + 6ĵ. Busca qué número multiplicado por 2 da 6." },
      { t: "3", ok: true },
      { t: "4", ok: false, fb: "Si k fuera 4, el resultado sería 8î + 12ĵ." },
      { t: "1/3", ok: false, fb: "Si usas 1/3, el vector se haría más pequeño (fracciones), pero aquí los números crecieron." }
    ]
  },
  {
    id: "T4F36",
    q: "Si -2 * (xî + yĵ) = -8î + 10ĵ, ¿cuál era el vector original xî + yĵ?",
    opts: [
      { t: "(4, -5)", ok: true },
      { t: "(-4, 5)", ok: false, fb: "Si el vector fuera -4î + 5ĵ y lo multiplicas por -2, el resultado daría +8î - 10ĵ. Los signos están al revés." },
      { t: "(16, -20)", ok: false, fb: "En lugar de dividir el resultado entre -2 para hallar el original, lo volviste a multiplicar." },
      { t: "(-10, 8)", ok: false, fb: "Recuerda el orden de las componentes xî + yĵ. Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F37",
    q: "TecDuck calcula la operación: 2 * (î + ĵ) + 3 * (î + ĵ). ¿Cuál es el resultado final?",
    opts: [
      { t: "6î + 6ĵ", ok: false, fb: "Parece que multiplicaste 2 * 3 en lugar de sumar los vectores resultantes (2+3 = 5)." },
      { t: "5î + 5ĵ", ok: true },
      { t: "î + ĵ", ok: false, fb: "Este es el vector base sin aplicar los escalares. Debes realizar las operaciones." },
      { t: "10î + 10ĵ", ok: false, fb: "Has sumado (2+3) y luego lo multiplicaste por 2 otra vez. Solo junta las partes: 2î + 2ĵ + 3î + 3ĵ." }
    ]
  },
  {
    id: "T4F38",
    q: "Resuelve: 4 * (2î + 0ĵ) - (8î + 0ĵ).",
    opts: [
      { t: "8î + 0ĵ", ok: false, fb: "Realizaste la multiplicación 8î + 0ĵ pero se te olvidó restar el segundo vector." },
      { t: "0î + 0ĵ", ok: true },
      { t: "16î + 0ĵ", ok: false, fb: "En lugar de restar 8î + 0ĵ, lo sumaste. Observa el signo de la operación." },
      { t: "0î + 8ĵ", ok: false, fb: "Recuerda el orden de las componentes (x, y). Primero va el eje horizontal (x) y luego el vertical (y)." }
    ]
  },
  {
    id: "T4F39",
    q: "Si multiplicas un vector de magnitud 5 por el escalar -2, la nueva magnitud del vector es:",
    opts: [
      { t: "-10", ok: false, fb: "La magnitud (distancia o tamaño) siempre es un valor positivo. El signo negativo solo cambia hacia dónde apunta." },
      { t: "10", ok: true },
      { t: "3", ok: false, fb: "Realizaste una resta 5 – 2. Debes multiplicar la magnitud base por el valor absoluto del escalar." },
      { t: "-3", ok: false, fb: "Las magnitudes no pueden ser negativas." }
    ]
  },
  {
    id: "T4F40",
    q: "TecDuck recorre 5î + 5ĵ en un día. Para regresar al punto de inicio, debe aplicar un escalar de:",
    opts: [
      { t: "0", ok: false, fb: "Multiplicar por 0 lo dejaría estático en el lugar donde terminó su viaje, no lo llevaría de regreso." },
      { t: "-1", ok: true },
      { t: "1", ok: false, fb: "Multiplicar por 1 significa volver a hacer exactamente el mismo recorrido, alejándose más del inicio." },
      { t: "2", ok: false, fb: "Multiplicar por 2 lo haría avanzar el doble de lejos en la misma dirección. Necesita el sentido opuesto." }
    ]
  }
  ]);
})();
