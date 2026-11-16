const questions = {
  math: {
    category: "MATEMÁTICA · QUESTÃO INSPIRADA NO ENEM",
    title: "Porcentagem no dia a dia",
    question: "Uma feira recebeu 200 kg de alimentos. Se 35% foram destinados a uma instituição, quantos quilos foram doados?",
    answers: ["35 kg", "60 kg", "70 kg", "75 kg"],
    correct: 2,
    explanation: "Isso! 35% de 200 é 0,35 × 200 = 70 kg."
  },
  reading: {
    category: "LINGUAGENS · REVISÃO RÁPIDA",
    title: "Interpretação de texto",
    question: "Ao analisar uma campanha de conscientização, qual elemento ajuda mais a identificar sua intenção principal?",
    answers: ["Apenas o tamanho do texto", "A relação entre a imagem, a mensagem e o público", "O número de palavras difíceis", "A cor predominante, isoladamente"],
    correct: 1,
    explanation: "Boa! O sentido de uma campanha se constrói pela combinação de linguagem, contexto e público."
  },
  nature: {
    category: "CIÊNCIAS DA NATUREZA · QUESTÃO INSPIRADA NO ENEM",
    title: "Energia e sustentabilidade",
    question: "Uma casa passa a usar lâmpadas LED no lugar das incandescentes, mantendo o mesmo tempo de uso. Qual é o efeito esperado?",
    answers: ["Aumento do consumo de energia", "Redução do consumo de energia", "A mesma potência consumida", "Interrupção da corrente elétrica"],
    correct: 1,
    explanation: "Isso! LEDs entregam iluminação com menor consumo de energia."
  },
  writing: {
    category: "REDAÇÃO · ESTRATÉGIA DE ESCRITA",
    title: "Construindo argumentos",
    question: "Em um parágrafo argumentativo, qual é a função de um repertório sociocultural bem conectado ao tema?",
    answers: ["Substituir a tese da redação", "Alongar o texto sem desenvolver ideias", "Sustentar o ponto de vista com uma referência pertinente", "Apresentar uma proposta de intervenção completa"],
    correct: 2,
    explanation: "Perfeito! O repertório fortalece a argumentação quando é pertinente e explicado."
  }
};

const dialog = document.querySelector("#lesson-dialog");
const category = document.querySelector("#dialog-category");
const title = document.querySelector("#dialog-title");
const questionText = document.querySelector("#dialog-question");
const answerList = document.querySelector("#answer-list");
const feedback = document.querySelector("#answer-feedback");
const nextButton = document.querySelector("#dialog-next");
let activeQuestion;
let activityComplete = false;
let missionCount = 2;
let xp = 240;
let progress = 12;

function openActivity(key) {
  activeQuestion = questions[key] || questions.math;
  activityComplete = false;
  category.textContent = activeQuestion.category;
  title.textContent = activeQuestion.title;
  questionText.textContent = activeQuestion.question;
  feedback.textContent = "";
  feedback.classList.remove("incorrect-feedback");
  nextButton.hidden = true;
  answerList.replaceChildren();

  activeQuestion.answers.forEach((answer, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "answer-option";
    option.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
    option.addEventListener("click", () => selectAnswer(index));
    answerList.append(option);
  });

  dialog.showModal();
}

function selectAnswer(selectedIndex) {
  const options = [...answerList.querySelectorAll(".answer-option")];
  options.forEach((option, index) => {
    option.disabled = true;
    if (index === activeQuestion.correct) option.classList.add("correct");
    if (index === selectedIndex && index !== activeQuestion.correct) option.classList.add("incorrect");
  });

  if (selectedIndex === activeQuestion.correct) {
    feedback.textContent = activeQuestion.explanation;
    feedback.classList.remove("incorrect-feedback");
    if (!activityComplete) {
      activityComplete = true;
      xp += 20;
      missionCount = Math.min(missionCount + 1, 4);
      progress = Math.min(progress + 3, 100);
      updateProgress();
    }
    nextButton.hidden = false;
  } else {
    feedback.textContent = "Quase! Releia a pergunta e tente mais uma vez.";
    feedback.classList.add("incorrect-feedback");
    options.forEach((option) => { option.disabled = false; });
  }
}

function updateProgress() {
  document.querySelector("#xp-total").textContent = xp;
  document.querySelector("#overall-progress").textContent = `${progress}%`;
  document.querySelector("#overall-progress-bar").style.width = `${progress}%`;
  document.querySelector("#mission-count").textContent = `${missionCount} de 4 atividades`;
  document.querySelector("#mission-percent").textContent = `${missionCount * 25}%`;
  document.querySelector("#mission-progress-bar").style.width = `${missionCount * 25}%`;
}

document.querySelectorAll("[data-open-lesson]").forEach((button) => {
  button.addEventListener("click", () => openActivity(button.dataset.openLesson));
});

document.querySelector("#continue-button").addEventListener("click", () => openActivity("math"));
document.querySelector("#question-button").addEventListener("click", () => openActivity("math"));
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
nextButton.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".nav-link.active")?.classList.remove("active");
    link.classList.add("active");
  });
});
