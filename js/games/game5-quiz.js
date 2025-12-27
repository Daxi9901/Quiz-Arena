// GAME 5 – Opšte znanje (BEZ TAJMERA – STABILNA VERZIJA)

const Game5 = (() => {

  /* ===============================
     STATE
  =============================== */

  let allData = [];
  let queue = [];
  let queueIndex = 0;

  let current = null;
  let answered = false;
  let gameEnded = false;

  // ⏱ TIMER – IDENTIČAN PATTERN KAO GAME1
  let timer = 60;
  let timerInterval = null;

  let score = 0;
  let correctCount = 0;

  const POINTS_PER_CORRECT = 2;


  /* ===============================
     HELPERS
  =============================== */
  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

/* ===============================
   QUEUE (NO REPEAT UNTIL EMPTY)
=============================== */
function resetQueue() {
  queue = shuffle([...allData]); // 🔀 promućkaj SVE
  queueIndex = 0;
}

function getNextQuestion() {
  if (queueIndex >= queue.length) {
    resetQueue(); // tek kad se ISTROŠI
  }
  return queue[queueIndex++];
}

  /* ===============================
     INIT
  =============================== */
async function init() {

  gameEnded = false;
  answered = false;

  timer = 60;
  score = 0;
  correctCount = 0;

  if (allData.length === 0) {
    const res = await fetch("data/game5.json");
    allData = await res.json();
  }


 if (queue.length === 0 || queueIndex >= queue.length) {
  resetQueue();
}

current = getNextQuestion();

  render();
  startTimer();   // ✅ START KAO U GAME1
}

function startTimer() {
  // 🔥 HARD RESET — ubija SVE stare intervale
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  timerInterval = setInterval(() => {
    if (gameEnded) {
      clearInterval(timerInterval);
      timerInterval = null;
      return;
    }

    timer--;

    const t = document.getElementById("timer");
    if (t) t.textContent = timer;

    if (timer <= 0) {
      finishGame("TIME_UP");
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}





  /* ===============================
     RENDER
  =============================== */
  function render() {
    const screen = document.getElementById("screen");
    const liveScore = GameEngine.getTotalScore() + score;

    answered = false;

    screen.innerHTML = `
      <div class="home-panel">

        <div class="game-header">
          <div class="game-title">Opšte znanje</div>
          <div class="game-stats">
            <span>⏱ <span id="timer">${timer}</span>s</span>
            <span>⭐ ${liveScore}</span>
          </div>
        </div>

        <div class="opste-question">
          ${current.question}
        </div>

        <div class="opste-answers-grid">
          ${current.options.map((opt, i) => `
            <button class="opste-answer" data-i="${i}">
              ${opt}
            </button>
          `).join("")}
        </div>

        <div class="opste-actions">
          <button id="nextBtn" class="neon-btn" disabled>Dalje</button>
          <button id="quitBtn" class="neon-btn danger">Odustani</button>
        </div>

      </div>
    `;

    document.querySelectorAll(".opste-answer").forEach(btn => {
      btn.onclick = () => checkAnswer(btn);
    });

    document.getElementById("nextBtn").onclick = nextQuestion;
    document.getElementById("quitBtn").onclick = () => finishGame("ODUSTAO");
  }

  /* ===============================
     CHECK ANSWER
  =============================== */
  function checkAnswer(btn) {
    if (answered || gameEnded) return;
    answered = true;

    const idx = Number(btn.dataset.i);

    document.querySelectorAll(".opste-answer")
      .forEach(b => b.disabled = true);

    if (idx === current.correct) {
      btn.classList.add("correct");
      score += POINTS_PER_CORRECT;
      correctCount++;
    } else {
      btn.classList.add("wrong");
      document
        .querySelector(`.opste-answer[data-i="${current.correct}"]`)
        ?.classList.add("correct");
    }

    
    document.getElementById("nextBtn").disabled = false;
  }

  /* ===============================
     NEXT QUESTION
  =============================== */
function nextQuestion() {
  if (gameEnded) return;

  current = getNextQuestion();
  answered = false;
  render();
}




function submitAnswer(isCorrect) {
  if (answered || gameEnded) return;
  answered = true;

  if (isCorrect) {
    score += POINTS_PER_CORRECT;
    correctCount++;
  }

  setTimeout(loadQuestion, 200);
}


  /* ===============================
     FINISH GAME
  =============================== */
function finishGame(reason) {
  if (gameEnded) return;
  gameEnded = true;

  stopTimer(); // ⬅️ OVO JE KLJUČNO

  if (timerInterval) {
  clearInterval(timerInterval);
  timerInterval = null;
}


  GameEngine.finish({
    winner: 1,
    points: score,
    reason,
    silent: true
  });

  GameEngine.saveGameHighScore("opste", score);

  UIScreens.showReveal({
    title: "OPŠTE ZNANJE",
    message: `
      <div>Tačni odgovori: <strong>${correctCount}</strong></div>
      <div class="reveal-points">Poeni u igri: <strong>${score}</strong></div>
    `,
    totalScore: GameEngine.getTotalScore(),
    buttonText: "Sledeća igra",
    onNext: GameEngine.nextGame
  });
}


  return { init };
})();
