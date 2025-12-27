// GAME 7 – Izreke i citati (2 citata × 60s, pomoć = manji poeni)

const Game7 = (() => {

  /* ===============================
     STATE
  =============================== */
  let data = [];
  let current = null;
  let queue = [];
  let queueIndex = 0;
  let userAnswers = [];


  let round = 0;
  let roundFinished = false;
  let gameEnded = false;
  let GAME7_INDEX = Number(localStorage.getItem("game7Index")) || 0;


    // ⏱ GLOBALNI TIMER (isto kao Game1)
  let timer = 60;
  let timerInterval = null;


  const TOTAL_ROUNDS = 2;
  const TIME_PER_ROUND = 60;

 

  let score = 0;
  let helpedSlots = [];
  let helpsUsed = 0;
  let lastRoundScore = 0;

  const MAX_POINTS_PER_CITAT = 25;

  /* ===============================
     INIT
  =============================== */
async function init() {
  stopTimer();        // ⛔ gasi sve

  timer = 60;

  gameEnded = false;
  roundFinished = false;
  round = 0;
  score = 0;

  const res = await fetch("data/izreke_rs.json");
  data = await res.json();

  if (!queue.length) {
  queue = [...data].sort(() => Math.random() - 0.5);
}

queueIndex = GAME7_INDEX;

if (queueIndex >= queue.length) {
  queue = [...data].sort(() => Math.random() - 0.5);
  queueIndex = 0;
  GAME7_INDEX = 0;
}


  loadNextRound();    // ✅ ovo JEDINO startuje tajmer
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
     ROUND FLOW
  =============================== */
function loadNextRound() {
  if (gameEnded) return;

  stopTimer();                 // ⛔ ugasi stari
  timer = TIME_PER_ROUND;      // ⏱ reset na 60

  if (round >= TOTAL_ROUNDS) {
    finishGame();
    return;
  }

  roundFinished = false;
  helpedSlots = [];
  helpsUsed = 0;
  lastRoundScore = 0;

  current = queue[queueIndex++];
GAME7_INDEX = queueIndex;
localStorage.setItem("game7Index", GAME7_INDEX);

  if (!current) {
    finishGame();
    return;
  }

  userAnswers = Array(current.missing.length).fill("");

  render();
  startTimer();                // ✅ OVO TI JE FALILO
}




function onTimeExpired() {
  if (roundFinished || gameEnded) return;

  const inputs = [...document.querySelectorAll(".blank-input")];
  userAnswers = inputs.map(i => i.value.trim());

  roundFinished = true;


  round++;
  showReveal(false);
}



  /* ===============================
     HELP
  =============================== */
function useHelp() {
  if (roundFinished || gameEnded) return;

  const inputs = [...document.querySelectorAll(".blank-input")];

  const emptyIndexes = inputs
    .map((inp, i) => (inp.value.trim() === "" ? i : null))
    .filter(i => i !== null);

  if (!emptyIndexes.length) return;

  const idx = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

  inputs[idx].value = current.missing[idx];
  inputs[idx].disabled = true;
  inputs[idx].classList.add("hint");

  userAnswers[idx] = current.missing[idx];
  helpsUsed++;
}


  /* ===============================
     CHECK ANSWER
  =============================== */
function checkAnswer() {
  if (roundFinished || gameEnded) return;

  stopTimer(); // ✅ UBICA BAGOVA

  const inputs = [...document.querySelectorAll(".blank-input")];
  if (!inputs.some(i => i.value.trim())) return;

  userAnswers = inputs.map(i => i.value.trim());
  roundFinished = true;

  let correct = 0;

inputs.forEach((inp, i) => {
  const isHint = inp.classList.contains("hint");

  if (!isHint && normalize(inp.value) === normalize(current.missing[i])) {
    correct++;
    inp.classList.add("correct");
  } else if (isHint) {
    // hint = tačno, ali ne donosi poene
    inp.classList.add("hint");
  } else {
    inp.classList.add("wrong");
  }

  inp.disabled = true;
});



  lastRoundScore = calculateScore(correct, current.missing.length, helpsUsed);
  score += lastRoundScore;



  round++;
  showReveal(true);
}





  

  /* ===============================
     GIVE UP
  =============================== */
function giveUp() {
  if (roundFinished || gameEnded) return;

  

  const inputs = [...document.querySelectorAll(".blank-input")];
  userAnswers = inputs.map(i => i.value.trim());

  roundFinished = true;


  round++;
  showReveal(false);
}

  /* ===============================
     SCORING
  =============================== */
function calculateScore(correct, total, helps) {
  if (!total) return 0;

  const accuracy = correct / total;
  let points = accuracy * MAX_POINTS_PER_CITAT;

  const HELP_PENALTY = 0.2; // ⬅️ 20% po pomoći
  const penaltyFactor = Math.max(0, 1 - helps * HELP_PENALTY);

  points = points * penaltyFactor;

  return Math.round(points);
}




  /* ===============================
     HELPERS
  =============================== */
  function normalize(str) {
    return str.toLowerCase()
      .replace(/đ/g, "dj")
      .replace(/š/g, "s")
      .replace(/ž/g, "z")
      .replace(/č/g, "c")
      .replace(/ć/g, "c")
      .trim();
  }

  function getAuthor(item) {
    return item?.author || item?.source?.author || "";
  }

function buildRevealQuote() {
  const parts = current.text.split("___");
  let html = "";

  for (let i = 0; i < parts.length; i++) {
    html += `<span>${parts[i]}</span>`;

    if (i < current.missing.length) {
      const user = (userAnswers[i] || "").trim();
      const correct = (current.missing[i] || "").trim();

      let cls = "reveal-empty";
      let content = correct;

      if (user) {
        if (normalize(user) === normalize(correct)) {
          cls = helpsUsed > 0 ? "reveal-hint" : "reveal-correct";
          content = user;
        } else {
          cls = "reveal-wrong";
          content = `${user} → ${correct}`;
        }
      }

      html += `<span class="reveal-blank ${cls}">${content}</span>`;
    }
  }

  return html;
}



  /* ===============================
     RENDER
  =============================== */
  function render() {
    const screen = document.getElementById("screen");
    const liveScore = GameEngine.getTotalScore() + score;

    const parts = current.text.split("___");
    let html = "";

    parts.forEach((p, i) => {
      html += `<span>${p}</span>`;
      if (i < current.missing.length) {
        html += `<input class="blank-input" autocomplete="off" />`;
      }
    });

    screen.innerHTML = `
      <div class="home-panel">
        <div class="game-header">
          <div class="game-title">Izreke i citati</div>
         <div class="game-stats">
            <span>⏱ <span id="timer">${timer}</span>s</span>
            <span>⭐ ${liveScore}</span>
          </div>
        </div>

        <div class="quote-box">${html}</div>

        <div class="game-buttons">
          <button id="checkBtn" class="neon-btn">POTVRDI</button>
          <button id="helpBtn" class="neon-btn secondary">POMOĆ</button>
          <button id="giveUpBtn" class="neon-btn danger">ODUSTANI</button>
        </div>
      </div>
    `;

    document.getElementById("checkBtn").onclick = checkAnswer;
    document.getElementById("helpBtn").onclick = useHelp;
    document.getElementById("giveUpBtn").onclick = giveUp;
  }

 function onRevealNext() {
  if (round >= TOTAL_ROUNDS) {
    finishGame();      // kraj igre → engine
  } else {
    loadNextRound();   // sledeći citat
  }
}


function showReveal(scored) {
  const author = getAuthor(current);
  const revealHTML = buildRevealQuote();

  UIScreens.showReveal({
    title: "IZREKE I CITATI",
    totalScore: GameEngine.getTotalScore() + score,
   message: `
      <div class="reveal-sentence">
        ${revealHTML}
      </div>
      ${author ? `<div class="quote-author">— ${author}</div>` : ""}

      <div class="reveal-points">
        Poeni runde: <strong>${lastRoundScore}</strong><br>
        Ukupno u igri: <strong>${score}</strong>
      </div>
    `,
    buttonText: "Dalje",
    onNext: onRevealNext
  });
}


  /* ===============================
     FINISH GAME
  =============================== */
function finishGame() {
  if (gameEnded) return;
  gameEnded = true;

  stopTimer();

  GameEngine.finish({
    winner: 1,
    points: score,
    reason: "izreke",
    silent: true
  });

  GameEngine.saveGameHighScore("izreke", score);

  // ⬇️ KLJUČNA LINIJA
  GameEngine.nextGame();
}


  return { init };
})();
