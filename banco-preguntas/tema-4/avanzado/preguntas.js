/**
 * Tema 4 · Avanzado — Desafíos de escala (24 preguntas)
 */
(function () {
  "use strict";
  if (typeof quizBankRegistrar !== "function") {
    throw new Error("Carga quiz-bank-loader.js antes de este archivo.");
  }
  quizBankRegistrar("4", "dificil", [
  {
    id: "T4D01",
    q: "Calcula el resultado de la siguiente operación: -(1/2) * (-4î + 6ĵ)",
    opts: [
      { t: "2î - 3ĵ", ok: true },
      { t: "-2î + 3ĵ", ok: false, fb: "Aplicaste la división a la mitad, pero ignoraste la regla de los signos. Multiplicar un número negativo por otro negativo debe dar como resultado un número positivo." },
      { t: "2î + 3ĵ", ok: false, fb: "Multiplicaste correctamente el componente horizontal, pero olvidaste que el signo negativo del escalar también debe afectar a la componente vertical." },
      { t: "-8î + 12ĵ", ok: false, fb: "Parece que multiplicaste por el inverso del escalar (es decir, por 2). Recuerda que multiplicar por la fracción 1/2 equivale a dividir entre 2." }
    ]
  },
  {
    id: "T4D02",
    q: "Si resuelves la ecuación k(6î - 9ĵ) = (-2î + 3ĵ), ¿cuál es el valor del escalar k?",
    opts: [
      { t: "-1/3", ok: true },
      { t: "1/3", ok: false, fb: "Verifica tus signos. Si el vector original era positivo en X y el resultado es negativo, forzosamente el escalar debe ser un número negativo." },
      { t: "-3", ok: false, fb: "Recuerda que k = (valor resultante) / (valor original). Parece que dividiste al revés, tomando el número mayor como numerador." },
      { t: "3", ok: false, fb: "Observa el vector final. Si las componentes pasaron de 6 a 2, el tamaño se encogió, por lo que el escalar debe ser una fracción, no un número entero." }
    ]
  },
  {
    id: "T4D03",
    q: "Calcula la siguiente combinación lineal: 2(3î - ĵ) - 3(-î + 2ĵ)",
    opts: [
      { t: "9î - 8ĵ", ok: true },
      { t: "3î + 4ĵ", ok: false, fb: "Recuerda la jerarquía de operaciones. Realizaste primero la resta de los vectores base sin aplicar la multiplicación por los escalares." },
      { t: "9î + 4ĵ", ok: false, fb: "Tuviste un error con los signos en el eje Y. Tienes un -2 y le estás restando un 6 positivo, lo cual debe hacer que el número descienda más en los negativos." },
      { t: "3î - 8ĵ", ok: false, fb: "Revisa tu resta horizontal. Tienes 6 y debes restarle un -3. Restar un número negativo equivale a realizar una suma." }
    ]
  },
  {
    id: "T4D04",
    q: "Despeja el vector v en la siguiente ecuación: 3v + (2î - 4ĵ) = (11î + 5ĵ)",
    opts: [
      { t: "3î + 3ĵ", ok: true },
      { t: "(13/3)î + (1/3)ĵ", ok: false, fb: "En lugar de restar el vector (2î - 4ĵ) para pasarlo al otro lado del signo igual, lo sumaste. Usa siempre la operación inversa para despejar." },
      { t: "3î + (1/3)ĵ", ok: false, fb: "Restaste bien en X, pero en Y cometiste un error aritmético. Si a 5 le quitas un -4, el número debe crecer (se vuelve una suma)." },
      { t: "9î + 9ĵ", ok: false, fb: "Lograste despejar la suma correctamente, pero encontraste el valor de 3v. Te faltó el último paso: dividir entre el escalar para dejar a la v completamente sola." }
    ]
  },
  {
    id: "T4D05",
    q: "Resuelve la ecuación vectorial para encontrar v: 2(v - (î + ĵ)) = v + (3î - 2ĵ)",
    opts: [
      { t: "5î + 0ĵ", ok: true },
      { t: "4î - ĵ", ok: false, fb: "Parece que restaste el vector (2î + 2ĵ) en el lado derecho en lugar de pasarlo sumando. Las reglas del álgebra aplican idéntico para los vectores." },
      { t: "5î - 4ĵ", ok: false, fb: "Fallaste al combinar las componentes Y. Si sumas -2 con 2, el resultado debe neutralizarse, no acumularse negativamente." },
      { t: "î - 3ĵ", ok: false, fb: "Reagrupaste mal los términos. Sumaste v en el lado izquierdo en vez de restarlo para despejarlo correctamente." }
    ]
  },
  {
    id: "T4D06",
    q: "Si la magnitud del vector escalado ||k(3î + 4ĵ)|| = 20, ¿cuáles son los posibles valores de k?",
    opts: [
      { t: "4 o -4", ok: true },
      { t: "4", ok: false, fb: "Encontraste un valor correcto, pero recuerda que en matemáticas el valor absoluto de una variable en una ecuación tiene dos soluciones posibles que afectan la dirección." },
      { t: "16 o -16", ok: false, fb: "Parece que en lugar de dividir 20 entre la magnitud del vector, restaste los valores intentando despejar la k." },
      { t: "5 o -5", ok: false, fb: "Calculaste la magnitud del vector (que es 5), pero elegiste ese número como la respuesta final sin resolver la ecuación completa para k." }
    ]
  },
  {
    id: "T4D07",
    q: "Encuentra un vector que tenga una magnitud de 15, pero que apunte en la dirección exactamente opuesta al vector 4î - 3ĵ.",
    opts: [
      { t: "-12î + 9ĵ", ok: true },
      { t: "12î - 9ĵ", ok: false, fb: "Este vector tiene el tamaño correcto (15), pero apunta en la misma dirección que el original. El enunciado pedía el sentido opuesto." },
      { t: "-15î + 15ĵ", ok: false, fb: "Intentaste usar el número 15 directamente en las componentes. La magnitud es la longitud de la hipotenusa, no el valor directo de los catetos." },
      { t: "-12î - 9ĵ", ok: false, fb: "Multiplicaste por -3, pero solo le cambiaste el signo a la primera componente. El escalar negativo afecta a ambas." }
    ]
  },
  {
    id: "T4D08",
    q: "Los vectores u = aî + 4ĵ y v = -6î + 3ĵ son paralelos. ¿Cuál debe ser el valor del escalar a?",
    opts: [
      { t: "-8", ok: true },
      { t: "8", ok: false, fb: "Observa los signos. Para que la componente Y creciera de 3 a 4, el escalar debió ser positivo. Al multiplicar un número positivo por la X original (-6), el resultado no puede volverse positivo." },
      { t: "-2", ok: false, fb: "Parece que dividiste las componentes de Y al revés (3/4 en vez de 4/3) antes de multiplicarlo por el -6." },
      { t: "2", ok: false, fb: "Usaste la proporción incorrecta y además perdiste el signo negativo por el camino." }
    ]
  },
  {
    id: "T4D09",
    q: "Si tienes la ecuación vectorial 2aî + (b+3)ĵ = -2((a-4)î + 2bĵ), ¿cuáles son los valores de a y b?",
    opts: [
      { t: "a = 2, b = -3/5", ok: true },
      { t: "a = 2, b = 3/5", ok: false, fb: "Tu valor para 'a' es perfecto, pero en 'b' ignoraste el signo al realizar la división de -3 entre 5." },
      { t: "a = -2, b = -3/5", ok: false, fb: "Revisa el despeje en el componente X. Al pasar el -2a al lado izquierdo, pasa sumando (4a), no restando." },
      { t: "a = 4, b = -3", ok: false, fb: "Al distribuir el escalar -2 sobre (a-4), olvidaste multiplicar el -2 por el -4 para obtener el +8." }
    ]
  },
  {
    id: "T4D10",
    q: "Considera que el vector v es unitario (magnitud de 1). ¿Cuál es la magnitud del vector -5v?",
    opts: [
      { t: "5", ok: true },
      { t: "-5", ok: false, fb: "Recuerda que la magnitud representa una distancia física en el plano espacial. Las distancias no pueden ser valores negativos." },
      { t: "1", ok: false, fb: "Ignoraste por completo el escalar. El vector base mide 1, pero le estás aplicando un factor que estira su tamaño de manera proporcional." },
      { t: "25", ok: false, fb: "Elevaste el escalar al cuadrado. Eso aplica cuando escalas el área de una figura, pero la longitud de un vector se escala de manera lineal y directa." }
    ]
  },
  {
    id: "T4D11",
    q: "Resuelve la siguiente operación combinada con escalares en 3D: (1/2)(4î - 2ĵ + 6k̂) - 2(î + 0ĵ - k̂)",
    opts: [
      { t: "0î - ĵ + 5k̂", ok: true },
      { t: "0î - ĵ + k̂", ok: false, fb: "En el eje Z, restaste el número ignorando su signo propio. Tenías 3 y le restabas un -2, lo cual equivale a sumar." },
      { t: "4î - ĵ + 5k̂", ok: false, fb: "En el eje X, sumaste las componentes en vez de seguir la instrucción de resta que une a ambas partes de la ecuación." },
      { t: "0î + ĵ + 5k̂", ok: false, fb: "En el eje Y, si a -1 le quitas 0, el número se mantiene negativo. Tú le cambiaste el signo sin justificación." }
    ]
  },
  {
    id: "T4D12",
    q: "En el sistema de ecuaciones vectoriales, donde u y v son vectores: u + v = 4î + 2ĵ y 2u - v = 5î + 4ĵ. ¿Qué componentes tiene el vector u?",
    opts: [
      { t: "3î + 2ĵ", ok: true },
      { t: "î + 0ĵ", ok: false, fb: "Ese es el valor del vector v, no de u. Presta atención a qué variable lograste despejar o averigua el resultado faltante sustituyendo el valor que hallaste en la primera ecuación." },
      { t: "9î + 6ĵ", ok: false, fb: "Resolviste perfectamente la combinación de las ecuaciones para eliminar la variable, pero hallaste el valor de 3u. ¡Falta aplicar el escalar dividiendo todo entre 3!" },
      { t: "2î + ĵ", ok: false, fb: "Recuerda el orden de las componentes x, y. Primero va el eje horizontal (x) y luego el vertical (y). Has intercambiado los valores de tu respuesta." }
    ]
  },
  {
    id: "T4D13",
    q: "Resuelve la ecuación con combinación de escalares para encontrar x e y: x(2î + ĵ) + y(-î + 3ĵ) = 8î - 3ĵ.",
    opts: [
      { t: "x = 3, y = -2", ok: true },
      { t: "x = -3, y = 2", ok: false, fb: "Intercambiaste los signos finales de tus variables. Verifica tu despeje al sustituir la X encontrada en la primera ecuación lineal." },
      { t: "x = 4, y = 0", ok: false, fb: "Si usas estos valores e introduces y=0, el segundo vector desaparece. Si multiplicas 4 por 2î + ĵ el resultado es 8î + 4ĵ, lo cual no cumple la igualdad con 8î - 3ĵ." },
      { t: "x = 3, y = 2", ok: false, fb: "El valor de X es correcto, pero un error de signo al restar el 6 en el paso final provocó que tu Y saliera positiva en lugar de negativa." }
    ]
  },
  {
    id: "T4D14",
    q: "Encuentra a sabiendo que la magnitud del vector en 3D cumple: ||-a(î - ĵ + √2 k̂)|| = 8.",
    opts: [
      { t: "4 o -4", ok: true },
      { t: "4", ok: false, fb: "Encontraste la raíz principal, pero en ecuaciones de valor absoluto (derivadas de una magnitud) existen dos caminos numéricos (positivo y negativo) que te llevan a la misma distancia." },
      { t: "-4", ok: false, fb: "Sucede lo mismo que en el caso anterior; no descartes la posibilidad de la contraparte positiva que cumple con el mismo resultado escalar." },
      { t: "2 o -2", ok: false, fb: "Olvidaste sacarle la raíz cuadrada a la suma de los componentes antes de hacer el despeje. Dividiste 8 entre 4 en lugar de entre 2." }
    ]
  },
  {
    id: "T4D15",
    q: "Si los puntos A(1, 2), B(3, 5) y C(7, y) son colineales (están en la misma línea), debe existir un escalar multiplicador entre sus segmentos. ¿Cuál es el valor de y?",
    opts: [
      { t: "11", ok: true },
      { t: "9", ok: false, fb: "Encontraste el componente Y del vector resultante (que mide 9), pero olvidaste sumarle la coordenada de origen de A para hallar el punto C real en el plano." },
      { t: "14", ok: false, fb: "Calculaste el factor escalar (3) y por descuido lo multiplicaste por la coordenada del punto intermedio B en lugar de usarlo sobre el vector de desplazamiento." },
      { t: "10", ok: false, fb: "Hubo un error de proporción geométrica. Si en X el avance global fue el triple (de 2 a 6), en Y también debes asegurar el triple de salto respecto al origen original." }
    ]
  },
  {
    id: "T4D16",
    q: "En un triángulo, M es el punto medio del lado AB. Si A = (-2, 4) y M = (1, 1), encuentra la coordenada del vértice B usando álgebra de vectores (B = A + 2AM).",
    opts: [
      { t: "(4, -2)", ok: true },
      { t: "(-0.5, 2.5)", ok: false, fb: "Lo que hiciste fue calcular el punto medio de un nuevo segmento entre A y M. Queríamos hacer lo opuesto: usar a M como trampolín para encontrar el borde lejano B." },
      { t: "(0, -2)", ok: false, fb: "Te equivocaste sumando el avance de X. Si estás en -2 y debes avanzar 6 posiciones, pasas el cero y terminas en el lado de los positivos." },
      { t: "(3, -3)", ok: false, fb: "Este es el vector de desplazamiento desde A hacia M. Para llegar a las coordenadas de B, tenías que escalar ese vector al doble y sumarlo al punto de partida." }
    ]
  },
  {
    id: "T4D17",
    q: "El centroide (centro de gravedad) G de un triángulo se encuentra con la ecuación escalar G = 1/3 (A + B + C). Si los vértices son A(0,0), B(6,0) y C(3,9), calcula G.",
    opts: [
      { t: "(3, 3)", ok: true },
      { t: "(9, 9)", ok: false, fb: "Te quedaste únicamente con la primera parte del procedimiento. Sumaste los tres vértices, pero olvidaste multiplicarlo por la fracción que extrae el centro geométrico." },
      { t: "(4.5, 4.5)", ok: false, fb: "Parece que usaste el factor de escala 1/2, como si estuvieras sacando el punto medio entre dos puntos. El centroide promedia tres puntos, por lo que el escalar es 1/3." },
      { t: "(3, 0)", ok: false, fb: "Promediaste bien la componente X, pero ignoraste la altura proporcionada por el punto C en la componente vertical." }
    ]
  },
  {
    id: "T4D18",
    q: "El punto P descansa sobre el segmento de A(-1, 2) a B(8, 11). El vector de trayecto cumple con la escala AP = 2/3 AB. ¿Cuáles son las coordenadas de P?",
    opts: [
      { t: "(5, 8)", ok: true },
      { t: "(6, 6)", ok: false, fb: "Ese es únicamente el valor del vector escalado AP que acabas de calcular. No olvides que P es una ubicación; necesitas sumar este avance a las coordenadas originales de A." },
      { t: "(7, 9)", ok: false, fb: "Hiciste un cálculo erróneo sumando el vector AP directamente a las coordenadas del punto de destino B, en lugar de hacerlo desde el punto de inicio A." },
      { t: "(8, 5)", ok: false, fb: "Recuerda el orden de las componentes x, y. Primero va el eje horizontal (x) y luego el vertical (y). Las has invertido." }
    ]
  },
  {
    id: "T4D19",
    q: "Un triángulo dibujado con vectores tiene un área de 5 unidades. Si multiplicas cada uno de los vectores posición de sus vértices por el escalar -2, ¿cuál será la nueva área de la figura?",
    opts: [
      { t: "20", ok: true },
      { t: "-10", ok: false, fb: "Recuerda que el área es una medida de superficie física; siempre debe expresarse como un valor positivo, independientemente del signo del escalar usado para invertir la figura." },
      { t: "10", ok: false, fb: "Escalaste el área tomando solo el valor absoluto de la constante (|k|), pero multiplicar los lados de un triángulo afecta de manera simultánea tanto a la base como a la altura." },
      { t: "-20", ok: false, fb: "Elevaste el escalar al cuadrado de manera correcta en tu mente, pero decidiste conservar el signo negativo de manera errónea arrastrándolo a un concepto espacial bidimensional." }
    ]
  },
  {
    id: "T4D20",
    q: "TecDuck calcula un nuevo vector de trayectoria usando la fórmula w = 2u - (1/2)v. Sabiendo que u = -î + 4ĵ y v = -6î + 2ĵ, ¿cuál es el vector w resultante?",
    opts: [
      { t: "î + 7ĵ", ok: true },
      { t: "-5î + 7ĵ", ok: false, fb: "Sumaste las componentes en X en vez de realizar la resta de un número negativo. Tenías -2 y debías restar un -3 (lo que se convierte en suma)." },
      { t: "î + 9ĵ", ok: false, fb: "Restaste mal el componente vertical Y. Tienes 8 y debes quitarle 1, no agregarlo." },
      { t: "-5î + 9ĵ", ok: false, fb: "Tuviste fallas tanto en el cambio de signo de la componente X al restar, como en la operación básica de la componente Y. Agrupa con paréntesis." }
    ]
  },
  {
    id: "T4D21",
    q: "El vector de vuelo de TecDuck v = aî + bĵ cumple con la proporción a = 3b. Si la magnitud de su vuelo es √40, y sabemos que b es un número positivo, ¿cuál es el valor de b?",
    opts: [
      { t: "2", ok: true },
      { t: "4", ok: false, fb: "Este es el valor de b², no de b. Te detuviste un paso antes de aplicar la raíz cuadrada requerida al despejar la incógnita." },
      { t: "√10", ok: false, fb: "Parece que sacaste la raíz cuadrada del coeficiente 10 que multiplicaba a b² en lugar de pasarlo dividiendo hacia el 40 en el otro lado de la igualdad." },
      { t: "6", ok: false, fb: "Confundiste la variable resuelta. Si hallas que b=2, entonces a=6. El problema te pidió específicamente el valor de la componente b." }
    ]
  },
  {
    id: "T4D22",
    q: "TecDuck empuja un objeto con una fuerza F = -2î + 3ĵ. Para detener por completo otro objeto que viene hacia él con momento (cantidad de movimiento) P = 8î - 12ĵ, TecDuck debe multiplicar su fuerza por un escalar k tal que kF + P = 0î + 0ĵ. ¿Qué valor tiene k?",
    opts: [
      { t: "4", ok: true },
      { t: "-4", ok: false, fb: "Si utilizas un escalar negativo, al multiplicarlo por tu fuerza original se invertiría tu propio empuje, ayudando al objeto entrante en lugar de contrarrestarlo y lograr el balance en cero." },
      { t: "1/4", ok: false, fb: "Invertiste la relación al dividir. El escalar k es igual a la fuerza final requerida dividida entre tu fuerza actual, no al revés." },
      { t: "-1/4", ok: false, fb: "Igual que la opción anterior, dividiste erróneamente los componentes y además arrastraste un signo negativo que rompe el equilibrio de la ecuación de balance." }
    ]
  },
  {
    id: "T4D23",
    q: "Resuelve la siguiente ecuación que incluye magnitudes y escalares: ||k(3î - 4ĵ)|| + 2 = 17. ¿Cuáles son los valores matemáticamente posibles de k?",
    opts: [
      { t: "3 o -3", ok: true },
      { t: "3", ok: false, fb: "Encontraste una de las dos respuestas viables, pero obviaste que el valor absoluto dentro de la fórmula de magnitud abre la puerta a que el escalar original haya sido negativo y apuntara en la dirección opuesta." },
      { t: "5 o -5", ok: false, fb: "Utilizaste el valor de la magnitud del vector (que es 5) como la respuesta directa del escalar. Recuerda que había que despejar esa cifra pasándola a dividir el 15." },
      { t: "-3", ok: false, fb: "Al igual que la opción aislada positiva, marcar solo la respuesta negativa descarta una de las verdades del concepto matemático del valor absoluto." }
    ]
  },
  {
    id: "T4D24",
    q: "TecDuck tiene un vector de empuje u = 2î + 5ĵ. El viento añade un segundo vector v. Si se sabe que el viento tiene la misma dirección y sentido que el vector u, pero escala el movimiento de manera que el empuje total (u + v) es exactamente el triple de u, ¿qué vector representa la fuerza del viento (v)?",
    opts: [
      { t: "4î + 10ĵ", ok: true },
      { t: "6î + 15ĵ", ok: false, fb: "Este es el vector de empuje total combinado (es decir, las coordenadas de 3u). Lee de nuevo la pregunta: se te pidió aislar únicamente el vector de contribución del viento." },
      { t: "2î + 5ĵ", ok: false, fb: "Esa es la fuerza inicial del propio TecDuck. El problema señala que el viento ayudó tanto que el resultado final triplicó esa fuerza, por lo que el viento debe aportar el doble." },
      { t: "8î + 20ĵ", ok: false, fb: "Sobreestimaste la participación del escalar. Multiplicaste la fuerza original por 4, lo que crearía un resultado combinado de 5 veces el empuje original, rompiendo la condición establecida." }
    ]
  }
  ]);
})();
