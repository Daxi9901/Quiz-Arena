// GLOBALNI INDEX
let ASOC_GLOBAL_INDEX =
  Number(localStorage.getItem("asocIndex")) || 0;

const Game1 = (() => {

  let current = null;
  let clueIndex = 0;

  let timer = 60;
  let timerInterval = null;
  let roundFinished = false;
  let answersView = [];



  let roundNumber = 1;
  let roundScore = 0;
  let gameScore = 0;

  const POINTS = [25, 20, 15, 10, 5];
  const TOTAL_ROUNDS = 2;

  /* ===============================
     INIT
  =============================== */
async function init() {
  clearInterval(timerInterval);

  roundFinished = false;
  timer = 60;
  clueIndex = 0;

  roundNumber = 1;
  gameScore = 0;

  await loadRound();
}


  /* ===============================
     LOAD ROUND
  =============================== */
  async function loadRound() {
    clearInterval(timerInterval);

    roundFinished = false;   // ⬅️ DODAJ
    clueIndex = 0;
    roundScore = 0;
    timer = 60;

    if (!window.__ASOC_DATA__) {
      const res = await fetch("data/asocijacije.json");
      window.__ASOC_DATA__ = await res.json();
    }

    const data = window.__ASOC_DATA__;

    if (ASOC_GLOBAL_INDEX >= data.length) ASOC_GLOBAL_INDEX = 0;

    current = data[ASOC_GLOBAL_INDEX++];
    localStorage.setItem("asocIndex", ASOC_GLOBAL_INDEX);
    answersView = current.clues.map(() => "—");


    startTimer();
    render();
  }

  /* ===============================
     TIMER
  =============================== */
function startTimer() {
  stopTimer(); // uvek prvo gasi stari

  timerInterval = setInterval(() => {
    if (roundFinished) {
      stopTimer();
      return;
    }

    timer--;

    const t = document.getElementById("timer");
    if (t) t.textContent = timer;

    if (timer <= 0) {
      finishRound();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function normalize(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/č|ć/g, "c")
    .replace(/š/g, "s")
    .replace(/đ/g, "d")
    .replace(/ž/g, "z")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}




  /* ===============================
     RENDER (SAMO PLAY)
  =============================== */
function render() {
  const screen = document.getElementById("screen");
  const liveScore = GameEngine.getTotalScore() + gameScore;

  screen.innerHTML = `
    <div class="home-panel">
      <div class="game-header">
        <div class="game-title">ASOCIJACIJE</div>
        <div class="game-stats">
          <span>⏱ <span id="timer">${timer}</span>s</span>
          <span>⭐ ${liveScore}</span>
        </div>
      </div>

      <div class="asoc-single">
        <div class="asoc-number">${clueIndex + 1}</div>
        <div class="asoc-text">${current.clues[clueIndex]}</div>
        <div class="asoc-score">${POINTS[clueIndex]}p</div>
      </div>

      <input id="answerInput" class="asoc-input"
        placeholder="Upiši asocijaciju..." />

      <div class="game-buttons">
        <button id="confirmBtn" class="neon-btn">Potvrdi</button>
        <button id="nextBtn" class="neon-btn secondary">
          ${clueIndex === current.clues.length - 1 ? "Odustani" : "Dalje"}
        </button>
      </div>
    </div>
  `;

  document.getElementById("confirmBtn").onclick = checkAnswer;
  document.getElementById("nextBtn").onclick = nextClue;

  // ✅ ENTER HANDLER — MORA BITI OVDE
  const inputEl = document.getElementById("answerInput");
  inputEl.focus();

  inputEl.onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      checkAnswer();
    }
  };
}



  /* ===============================
     ACTIONS
  =============================== */
  function nextClue() {
    if (clueIndex >= current.clues.length - 1) {
      finishRound();
      return;
    }
    clueIndex++;
    render();
  }

function checkAnswer() {
  const inputEl = document.getElementById("answerInput");
  const input = inputEl.value.trim();

  // 1️⃣ ako nema unosa – ništa
  if (!input) return;

  // 2️⃣ ako je TAČNO → poeni + kraj runde
  if (normalize(input) === normalize(current.answer)) {
    roundScore = POINTS[clueIndex];
    answersView[clueIndex] = input;
    finishRound();
    return;
  }

  // 3️⃣ ako je POGREŠNO, ali ima još tragova → sledeći trag
  if (clueIndex < current.clues.length - 1) {
    answersView[clueIndex] = input;
    nextClue();
    return;
  }

  // 4️⃣ ako je POGREŠNO i NEMA više tragova → mali feedback
  inputEl.classList.add("input-error");
  setTimeout(() => inputEl.classList.remove("input-error"), 300);
}


  

  /* ===============================
     FINISH ROUND → UNIVERSAL REVEAL
  =============================== */
function finishRound() {
  if (roundFinished) return;
  roundFinished = true;

  stopTimer();

  // 🛡️ safety reset
  const earned = roundScore || 0;
  roundScore = 0;

  gameScore += earned;

  const isLastRound = roundNumber >= TOTAL_ROUNDS;

  UIScreens.showReveal({
    title: "ASOCIJACIJE",
    message: `
      <div>Tačan odgovor: <strong>${current.answer}</strong></div>
      <div class="reveal-points">
        Poeni runde: <strong>${earned}</strong><br>
        Ukupno u igri: <strong>${gameScore}</strong>
      </div>
    `,
    totalScore: GameEngine.getTotalScore() + gameScore,
    buttonText: isLastRound ? "Sledeća igra" : "Sledeća runda",
    onNext: goNext
  });
}


function goNext() {
  stopTimer(); // ⬅️ KLJUČNA LINIJA

  roundFinished = false;
  roundScore = 0;

  if (roundNumber < TOTAL_ROUNDS) {
    roundNumber++;
    loadRound();
  } else {
    GameEngine.finish({
      winner: 1,
      points: gameScore,
      reason: "ASOCIJACIJE",
      silent: true
    });

    GameEngine.saveGameHighScore("asocijacije", gameScore);
    GameEngine.nextGame();
  }
}



  return { init };
})();
