// Banco de preguntas; las opciones y el orden de las preguntas se mezclan en cada intento.
const quizQuestions = [
  {
    category: "TOMA DE DECISIONES",
    question: "¿Qué caracteriza principalmente a una decisión estratégica?",
    answers: [
      "Define el rumbo de largo plazo de la organización",
      "Resuelve una tarea rutinaria del día",
      "Asigna turnos para la próxima semana",
      "Corrige un registro duplicado"
    ],
    correct: "Define el rumbo de largo plazo de la organización",
    explanation: "Las decisiones estratégicas orientan el futuro y los objetivos generales de la organización."
  },
  {
    category: "TOMA DE DECISIONES",
    question: "¿Cuál es un ejemplo de decisión operativa?",
    answers: [
      "Entrar a un nuevo mercado internacional",
      "Reponer hoy un producto que llegó al mínimo de inventario",
      "Cambiar el modelo de negocio de la empresa",
      "Definir la estrategia de marca a cinco años"
    ],
    correct: "Reponer hoy un producto que llegó al mínimo de inventario",
    explanation: "Las decisiones operativas gestionan acciones concretas del trabajo diario."
  },
  {
    category: "TOMA DE DECISIONES",
    question: "¿Cómo ayuda el BI a tomar mejores decisiones?",
    answers: [
      "Sustituye por completo el criterio de las personas",
      "Elimina la necesidad de definir objetivos",
      "Aporta evidencia, contexto y seguimiento de resultados",
      "Garantiza que todas las decisiones sean exitosas"
    ],
    correct: "Aporta evidencia, contexto y seguimiento de resultados",
    explanation: "El BI informa y permite medir resultados; no reemplaza el criterio ni garantiza el éxito."
  },
  {
    category: "TOMA DE DECISIONES",
    question: "Una jefatura compara los resultados mensuales para asignar presupuesto a campañas. ¿Qué tipo de decisión es?",
    answers: [
      "Estratégica",
      "Táctica",
      "Operativa",
      "Automática"
    ],
    correct: "Táctica",
    explanation: "La asignación de presupuesto a planes de área es una decisión táctica de mediano plazo."
  },
  {
    category: "PROCESO ETL",
    question: "¿Qué significa la sigla ETL?",
    answers: [
      "Evaluate, Track, Launch",
      "Extract, Transform, Load",
      "Enter, Transfer, Link",
      "Explore, Test, Learn"
    ],
    correct: "Extract, Transform, Load",
    explanation: "ETL resume las fases de extracción, transformación y carga de datos."
  },
  {
    category: "PROCESO ETL",
    question: "¿En qué fase se eliminan duplicados y se estandarizan fechas?",
    answers: [
      "Extracción",
      "Transformación",
      "Carga",
      "Visualización"
    ],
    correct: "Transformación",
    explanation: "La transformación limpia y estandariza los datos antes de cargarlos al destino."
  },
  {
    category: "PROCESO ETL",
    question: "¿Cuál de estas actividades pertenece a la extracción?",
    answers: [
      "Leer transacciones de un ERP y registros de una hoja de cálculo",
      "Unificar formatos de moneda",
      "Guardar datos preparados en un almacén",
      "Diseñar un gráfico de ventas"
    ],
    correct: "Leer transacciones de un ERP y registros de una hoja de cálculo",
    explanation: "Extraer consiste en recopilar datos desde las fuentes de origen."
  },
  {
    category: "PROCESO ETL",
    question: "¿Cuál es el objetivo de la fase Load (carga)?",
    answers: [
      "Definir las preguntas del negocio",
      "Capturar datos de las fuentes originales",
      "Guardar datos preparados en un destino para su análisis",
      "Eliminar indicadores que no se utilizan"
    ],
    correct: "Guardar datos preparados en un destino para su análisis",
    explanation: "En la carga se almacena el conjunto ya preparado en un destino, como un almacén de datos."
  },
  {
    category: "BI EN ACCIÓN",
    question: "Un comercio analiza ventas históricas para anticipar qué productos reponer. ¿Qué valor del BI aplica?",
    answers: [
      "Previsión de demanda e inventario",
      "Diseño de interfaces",
      "Compresión de imágenes",
      "Gestión de contraseñas"
    ],
    correct: "Previsión de demanda e inventario",
    explanation: "El análisis de ventas ayuda a estimar demanda y planificar la reposición."
  },
  {
    category: "BI EN ACCIÓN",
    question: "¿Qué práctica favorece decisiones basadas en datos confiables?",
    answers: [
      "Combinar fuentes sin revisar su formato",
      "Usar solo el dato más reciente, aunque esté incompleto",
      "Validar, limpiar y contextualizar los datos antes de analizarlos",
      "Elegir la métrica con el resultado más alto"
    ],
    correct: "Validar, limpiar y contextualizar los datos antes de analizarlos",
    explanation: "La calidad y el contexto de los datos son esenciales para que el análisis sea útil."
  }
];

const quizState = {
  questions: [],
  currentIndex: 0,
  score: 0,
  answered: false
};

const bestScoreKey = "dataclara-bi-quiz-best-score";

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function getBestScore() {
  const storedScore = Number.parseInt(localStorage.getItem(bestScoreKey) ?? "0", 10);
  return Number.isFinite(storedScore) && storedScore >= 0 ? storedScore : 0;
}

function updateBestScoreDisplay() {
  document.querySelector("#best-score").textContent = `${getBestScore()} pts`;
}

function renderQuestion() {
  const question = quizState.questions[quizState.currentIndex];
  const answerContainer = document.querySelector("#quiz-answers");
  const progress = document.querySelector("#quiz-progress");
  const progressBar = document.querySelector(".progress-track");
  const questionArea = document.querySelector("#quiz-question-area");

  document.querySelector("#quiz-counter").textContent = `PREGUNTA ${quizState.currentIndex + 1} DE ${quizState.questions.length}`;
  document.querySelector("#quiz-question-number").textContent = `${String(quizState.currentIndex + 1).padStart(2, "0")} / ${String(quizState.questions.length).padStart(2, "0")}`;
  document.querySelector("#quiz-category").textContent = question.category;
  document.querySelector("#quiz-question").textContent = question.question;
  document.querySelector("#quiz-score").textContent = String(quizState.score);
  document.querySelector("#quiz-feedback").textContent = "";
  document.querySelector("#quiz-next").disabled = true;
  document.querySelector("#quiz-next").innerHTML = 'Comprobar respuesta <i class="bi bi-arrow-right" aria-hidden="true"></i>';
  answerContainer.replaceChildren();
  progress.style.width = `${(quizState.currentIndex / quizState.questions.length) * 100}%`;
  progressBar.setAttribute("aria-valuenow", String(quizState.currentIndex));
  quizState.answered = false;

  shuffle(question.answers).forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.type = "button";
    button.dataset.answer = answer;
    button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${answer}</span>`;
    button.addEventListener("click", () => selectAnswer(button, question));
    answerContainer.append(button);
  });

  questionArea.classList.remove("is-changing");
  void questionArea.offsetWidth;
  questionArea.classList.add("is-changing");
}

function selectAnswer(selectedButton, question) {
  if (quizState.answered) return;
  quizState.answered = true;
  const isCorrect = selectedButton.dataset.answer === question.correct;
  const buttons = [...document.querySelectorAll(".answer-option")];

  buttons.forEach((button) => {
    button.disabled = true;
    if (button.dataset.answer === question.correct) button.classList.add("is-correct");
  });

  const feedback = document.querySelector("#quiz-feedback");
  if (isCorrect) {
    quizState.score += 10;
    selectedButton.classList.add("is-correct");
    feedback.innerHTML = `<strong>¡Correcto! +10 puntos.</strong> ${question.explanation}`;
  } else {
    selectedButton.classList.add("is-wrong");
    feedback.innerHTML = `<strong>No es esa.</strong> ${question.explanation}`;
  }

  document.querySelector("#quiz-score").textContent = String(quizState.score);
  const nextButton = document.querySelector("#quiz-next");
  nextButton.disabled = false;
  nextButton.innerHTML = quizState.currentIndex === quizState.questions.length - 1
    ? 'Ver resultado <i class="bi bi-arrow-right" aria-hidden="true"></i>'
    : 'Siguiente pregunta <i class="bi bi-arrow-right" aria-hidden="true"></i>';
}

function getAward(score) {
  if (score === 100) return { medal: "💎", name: "Diamante", message: "¡Perfecto! Dominas los fundamentos de BI y ETL." };
  if (score >= 80) return { medal: "🥇", name: "Oro", message: "¡Excelente! Tienes una comprensión sólida de los conceptos." };
  if (score >= 50) return { medal: "🥈", name: "Plata", message: "¡Buen trabajo! Ya tienes una base; sigue explorando los temas." };
  return { medal: "🥉", name: "Bronce", message: "¡Toda gran aventura empieza aprendiendo! Repasa los fundamentos y vuelve a intentarlo." };
}

function showResult() {
  const result = document.querySelector("#quiz-result");
  const award = getAward(quizState.score);
  const previousBest = getBestScore();
  if (quizState.score > previousBest) {
    localStorage.setItem(bestScoreKey, String(quizState.score));
  }

  document.querySelector("#quiz-question-area").hidden = true;
  document.querySelector(".quiz-topline").hidden = true;
  document.querySelector(".progress-track").hidden = true;
  result.hidden = false;
  result.innerHTML = `
    <span class="result-medal" role="img" aria-label="Medalla ${award.name}">${award.medal}</span>
    <h3>¡Cuestionario completado!</h3>
    <p class="result-score">${quizState.score} / 100 puntos</p>
    <p class="result-message">${award.message}</p>
    <p class="result-detail">Medalla ${award.name} · ${quizState.score / 10} de 10 respuestas correctas</p><br>
    <button class="button button-dark" id="quiz-retry" type="button">Reintentar cuestionario <i class="bi bi-arrow-clockwise" aria-hidden="true"></i></button>`;
  document.querySelector("#quiz-retry").addEventListener("click", startQuiz);
  updateBestScoreDisplay();
}

function startQuiz() {
  quizState.questions = shuffle(quizQuestions);
  quizState.currentIndex = 0;
  quizState.score = 0;
  document.querySelector("#quiz-question-area").hidden = false;
  document.querySelector(".quiz-topline").hidden = false;
  document.querySelector(".progress-track").hidden = false;
  document.querySelector("#quiz-result").hidden = true;
  renderQuestion();
  updateBestScoreDisplay();
}

document.addEventListener("DOMContentLoaded", () => {
  const nextButton = document.querySelector("#quiz-next");
  if (!nextButton) return;

  nextButton.addEventListener("click", () => {
    if (!quizState.answered) return;
    if (quizState.currentIndex === quizState.questions.length - 1) {
      document.querySelector("#quiz-progress").style.width = "100%";
      document.querySelector(".progress-track").setAttribute("aria-valuenow", String(quizState.questions.length));
      showResult();
      return;
    }
    quizState.currentIndex += 1;
    renderQuestion();
  });

  startQuiz();
});
