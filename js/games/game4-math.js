// GAME 4 – Matematika

const Game4 = (() => {

  let data = [];
  let current = null;

  let globalIndex = 0;
  let timer = 60;
  

  let timerInterval = null;
  let gameFinished = false;


  let score = 0;
  let solvedCount;

  const POINTS_PER_TASK = 5;

  /* ===============================
     INIT
  =============================== */
  async function init() {
  stopTimer();

   gameFinished = false;

  timer = 60;
  score = 0;

  const res = await fetch("data/matematika.json");
  data = await res.json();

  globalIndex = Number(localStorage.getItem("mathIndex")) || 0;
  if (globalIndex >= data.length) globalIndex = 0;
  solvedCount = 0;


  current = data[globalIndex];
  

  render();
  startTimer();
}

  /* ===============================
     TIMER
  =============================== */
  function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
      timer--;
      const t = document.getElementById("timer");
      if (t) t.textContent = timer;

      if (timer <= 0) finishGame("VREME ISTEKLO");
    }, 1000);
  }

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}


  /* ===============================
     RENDER (PLAY ONLY)
  =============================== */
  function render() {
    const screen = document.getElementById("screen");
    const liveScore = GameEngine.getTotalScore() + score;

    screen.innerHTML = `
      <div class="home-panel">

        <div class="game-header">
          <div class="game-title">Matematika</div>
          <div class="game-stats">
            <span>⏱ <span id="timer">${timer}</span>s</span>
            <span>⭐ ${liveScore}</span>
          </div>
        </div>

        <div class="matematika-task">
          <div>ZADATAK</div>
          <strong>${current.q}</strong>
        </div>

        <input
          id="answerInput"
          class="asoc-input"
          placeholder="Unesi rezultat"
          inputmode="numeric"
          autocomplete="off"
        />

        <div class="game-buttons">
          <button id="submitBtn" class="neon-btn">Potvrdi</button>
          <button id="giveUpBtn" class="neon-btn secondary">Odustani</button>
        </div>

      </div>
    `;

    bindPlayUI();
  }

  /* ===============================
     UI
  =============================== */
  function bindPlayUI() {
    const input = document.getElementById("answerInput");
    const submit = document.getElementById("submitBtn");
    const giveUp = document.getElementById("giveUpBtn");

    input.focus();

    input.onkeydown = e => {
      if (e.key === "Enter") checkAnswer();
    };

    submit.onclick = checkAnswer;
    giveUp.onclick = () => finishGame("ODUSTAO");
  }

  /* ===============================
     LOGIC
  =============================== */
function checkAnswer() {
  const input = document.getElementById("answerInput");
  const raw = input.value.trim();
  if (!raw) return;

  const userVal = Number(raw);
  if (Number.isNaN(userVal)) return;

  if (userVal === Number(current.a)) {
    score += POINTS_PER_TASK;
    solvedCount++;
    input.value = "";

    loadNextQuestion(); // ✅ SAMO AKO JE TAČNO
  } else {
    input.classList.add("input-error");
    setTimeout(() => input.classList.remove("input-error"), 300);
    input.select(); // 👌 ostaje isti zadatak
  }
}



  function loadNextQuestion() {
    globalIndex++;
    if (globalIndex >= data.length) globalIndex = 0;

    localStorage.setItem("mathIndex", globalIndex);
    current = data[globalIndex];

    render();
  }

  /* ===============================
     FINISH GAME → UNIVERSAL REVEAL
  =============================== */
function finishGame (reason) {
  if (gameFinished) return; // ⬅️ KLJUČNO
  gameFinished = true;

   stopTimer();
  // ✅ hard safety (za svaki slučaj)
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }

  GameEngine.finish({
    winner: 1,
    points: score,
    reason,
    silent: true
  });

  GameEngine.saveGameHighScore("matematika", score);

  // zapamti gde nastavljamo sledeću partiju
let nextIndex = globalIndex + 1;
if (nextIndex >= data.length) nextIndex = 0;




UIScreens.showReveal({
  title: "MATEMATIKA",
  message: `
    <div>Urađeno zadataka: <strong>${solvedCount}</strong></div>
    <div class="reveal-points">Poeni u igri: <strong>${score}</strong></div>
  `,
  totalScore: GameEngine.getTotalScore(),
  buttonText: "Sledeća igra",
  onNext: () => GameEngine.nextGame()
});


}


  return { init };
})();
