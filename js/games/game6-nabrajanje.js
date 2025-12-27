// GAME 6 – Nabrajanje

const Game6 = (() => {

  let data = [];
  let category = "";
  let letter = "";
  let letterBag = [];


  let gameEnded = false;

  // ⏱ TIMER
  let timer = 60;
  let timerInterval = null;

  let score = 0;
  const POINTS = 2;
  let usedWords = [];



  const categories = [
    { name: "države", file: "data/game6_drzave.json" },
    { name: "gradovi", file: "data/game6_gradovi.json" },
    { name: "planine", file: "data/game6_planine.json" },
    { name: "reke", file: "data/game6_reke.json" }
  ];

  const letters = "ABCDEFGHIJKLMNOPRSTUV".split("");

  /* ===============================
     INIT
  =============================== */
async function init() {
  stopTimer();          // ⛔ uvek prvo gasi
  gameEnded = false;

  timer = 60;           // ⏱ reset
  score = 0;
  usedWords = [];


    const cat = categories[Math.floor(Math.random() * categories.length)];
    category = cat.name;
    letter = getNextLetter();


    const res = await fetch(cat.file);
    const raw = await res.json();
    data = raw.map(w => normalize(w));
    
    
 
    render();
    startTimer(); 
  }

  function getNextLetter() {
  if (letterBag.length === 0) {
    letterBag = [...letters].sort(() => Math.random() - 0.5);
  }
  return letterBag.pop();
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
     RENDER (PLAY ONLY)
  =============================== */
function render() {
  const screen = document.getElementById("screen");
  const liveScore = GameEngine.getTotalScore() + score;

  screen.innerHTML = `
    <div class="home-panel">

      <div class="game-header">
        <div class="game-title">Geografija</div>
        <div class="game-stats">
          <span>⏱ <span id="timer">${timer}</span>s</span>
          <span>⭐ ${liveScore}</span>
        </div>
      </div>

      <!-- ✅ NOVI LEP BLOK -->
      <div class="nab-info">
        <div class="nab-category">
          Kategorija: <strong>${category.toUpperCase()}</strong>
        </div>

        <div class="nab-letter-wrap">
          <span class="nab-letter-label">Slovo</span>
          <div class="nab-letter">${letter}</div>
        </div>
      </div>

      <input
        id="answerInput"
        class="asoc-input"
        placeholder="Upiši naziv (bez 'reka', 'planina')"

        autocomplete="off"
      />

      <div class="game-buttons">
        <button class="neon-btn" id="submitBtn">DODAJ</button>
        <button class="neon-btn secondary" id="giveUpBtn">ODUSTANI</button>
      </div>

      <div class="used-words-box">
        <div class="used-words-title">Pogođeno:</div>
        <div id="wordsList" class="used-words-list">
          ${usedWords.map(w => `<div class="used-word">${w}</div>`).join("")}
        </div>
      </div>

    </div>
  `;

  document.getElementById("submitBtn").onclick = submit;
  document.getElementById("giveUpBtn").onclick = () => finishGame("ODUSTAO");
  document.getElementById("answerInput").onkeydown = e => {
    if (e.key === "Enter") submit();
  };
}


  /* ===============================
     GAME LOGIC
  =============================== */
  function submit() {
    if (gameEnded) return;

    const input = document.getElementById("answerInput");
    let word = normalize(input.value);
    input.value = "";

    if (
      !word ||
      !word.startsWith(letter.toLowerCase()) ||
      !data.includes(word) ||
      usedWords.includes(word)
    ) return;

    usedWords.push(word);
    score += POINTS;

    render();
  }

  /* ===============================
     NORMALIZE
  =============================== */
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

  placeholder="Upiši naziv (bez 'reka', 'planina')"


  /* ===============================
     FINISH GAME → UNIVERSAL REVEAL
  =============================== */
  function finishGame(reason) {
   if (gameEnded) return;
   gameEnded = true;   // ⬅️ DODAJ

   stopTimer();
  
    GameEngine.finish({
      winner: 1,
      points: score,
      reason: "Geografija",
      silent: true
    });

    GameEngine.saveGameHighScore("geografija", score);

    const message = `
      <div>Kategorija: <strong>${category}</strong></div>
      <div>Slovo: <strong>${letter}</strong></div>
      <div>Pogođene reči: <strong>${usedWords.length}</strong></div>
      <div style="margin-top:10px;">
        ${usedWords.map(w => `<span class="used-word">${w}</span>`).join(" ")}
      </div>
    `;

UIScreens.showReveal({
  title: "GEOGRAFIJA",
message: `
  <div>Pogođene reči:</div>

  <div class="reveal-words">
    ${
      usedWords.length
        ? usedWords.map(w => `<span class="word-chip">${w}</span>`).join("")
        : "<em>Nema pogođenih reči</em>"
    }
  </div>

  <div class="reveal-points">
    <div class="reveal-points">Poeni u igri: <strong>${score}</strong></div>
  </div>
`,

  totalScore: GameEngine.getTotalScore() + score,
  buttonText: "Sledeća igra",
  onNext: () => GameEngine.nextGame()
});

  }

  return { init };
})();
