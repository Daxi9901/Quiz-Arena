// GLOBALNI INDEX ZA SINONIME
let SIN_GLOBAL_INDEX =
  Number(localStorage.getItem("sinIndex")) || 0;

const Game2 = (() => {

  let currentRound = [];
  let activeRow = 0;

  let roundNumber = 1;
  let roundScore = 0;
  let gameScore = 0;

  let roundFinished = false;
  let timer = 60;
  let timerInterval = null;

  const WORDS_PER_ROUND = 5;
  const TOTAL_ROUNDS = 2;
  const POINTS = 2;

  /* ===============================
     INIT
  =============================== */
  async function init() {
    stopTimer();

    roundNumber = 1;
    gameScore = 0;

    await loadRound();
  }




  /* ===============================
     LOAD ROUND
  =============================== */
  async function loadRound() {
    stopTimer();
    roundFinished = false;

    timer = 60;
    activeRow = 0;
    roundScore = 0;

    if (!window.__SIN_DATA__) {
      const res = await fetch("data/sinonimi.json");
      window.__SIN_DATA__ = await res.json();
    }

    const data = window.__SIN_DATA__;

    if (SIN_GLOBAL_INDEX >= data.length) SIN_GLOBAL_INDEX = 0;

    currentRound = [];
    for (let i = 0; i < WORDS_PER_ROUND; i++) {
      currentRound.push({
        ...data[SIN_GLOBAL_INDEX++],
        userAnswer: ""
      });
    }

    localStorage.setItem("sinIndex", SIN_GLOBAL_INDEX);

    startTimer();
    render();
  }

  /* ===============================
     TIMER
  =============================== */
  function startTimer() {
    timerInterval = setInterval(() => {
      timer--;
      const t = document.getElementById("timer");
      if (t) t.textContent = timer;

      if (timer <= 0) finishRound();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
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
    .replace(/ž/g, "z");
}

function getAcceptedAnswers(a) {
  if (Array.isArray(a)) {
    return a.map(normalize);
  }
  return [normalize(a)];
}



  /* ===============================
     RENDER (SAMO PLAY)
  =============================== */
  function render() {
    const screen = document.getElementById("screen");
    const liveScore =
  GameEngine.getTotalScore() + gameScore + roundScore;


const tableRows = currentRound.map(item => `
  <tr class="sin-row">
    <td class="sin-left">
      <span class="sin-label">${item.q}</span>
    </td>
<td class="sin-right">
  ${item.userAnswer || "—"}
</td>
  </tr>
`).join("");

screen.innerHTML = `
  <div class="home-panel">

    <div class="game-header">
      <div class="game-title">Sinonimi</div>
      <div class="game-stats">
        <span>⏱ <span id="timer">${timer}</span>s</span>
        <span>⭐ ${liveScore}</span>
      </div>
    </div>

    <input
      id="answerInput"
      class="asoc-input"
      placeholder="Upiši odgovor..."
      autocomplete="off"
    />

    <div class="game-buttons">
      <button id="confirmBtn" class="neon-btn">Potvrdi</button>
      <button id="giveUpBtn" class="neon-btn secondary">Odustani</button>
    </div>

    <div class="sin-table-wrap">
      <table class="sin-table">
        <thead>
          <tr>
            <th>Zadato</th>
            <th>Odgovor</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>

  </div>
`;


    const input = document.getElementById("answerInput");
    input.focus();

    input.onkeydown = e => {
      if (e.key === "Enter") submitAnswer();
    };

    document.getElementById("confirmBtn").onclick = submitAnswer;
    document.getElementById("giveUpBtn").onclick = handleGiveUp;
  }

  /* ===============================
     GAME LOGIC
  =============================== */
  function submitAnswer() {
    const input = document.getElementById("answerInput");
    const user = normalize(input.value);
    if (!user) return;

    for (let i = 0; i < WORDS_PER_ROUND; i++) {
      if (currentRound[i].userAnswer) continue;

     const accepted = getAcceptedAnswers(currentRound[i].a);

if (accepted.includes(user)) {
  currentRound[i].userAnswer = "✔ " + user;
  roundScore += POINTS;

  while (
    activeRow < WORDS_PER_ROUND &&
    currentRound[activeRow].userAnswer
  ) activeRow++;

  break;
}

    }

    input.value = "";

    if (currentRound.every(r => r.userAnswer)) {
      finishRound();
    } else {
      render();
    }
  }

  function handleGiveUp() {
    currentRound.forEach(r => {
      r.userAnswer = "✖ " + (Array.isArray(r.a) ? r.a.join(", ") : r.a);
    });

    finishRound();
  }

  function formatAnswer(a) {
  return Array.isArray(a) ? a.join(", ") : a;
}

function renderAnswerPills(allAnswers, userAnswer) {
  const user = normalize(userAnswer || "");

  return allAnswers.map(a => {
    const isUser = normalize(a) === user;

    return `
      <span class="answer-pill ${isUser ? "hit" : ""}">
        ${a}
      </span>
    `;
  }).join("");
}

  /* ===============================
     FINISH ROUND → UNIVERSAL REVEAL
  =============================== */
function finishRound() {
  if (roundFinished) return;
  roundFinished = true;

  stopTimer();

  const earned = roundScore || 0;
  roundScore = 0;
  gameScore += earned;

  const tableRows = currentRound.map(item => `
    <tr class="sin-row">
      <td class="sin-left">${item.q}</td>
      <td class="sin-right">
  ${renderAnswerPills(
    Array.isArray(item.a) ? item.a : [item.a],
    item.userAnswer.replace(/^✔ |^✖ /, "")
  )}
</td>
    </tr>
  `).join("");

  UIScreens.showReveal({
    title: "SINONIMI",
    message: `
      <table class="sin-table">
        <thead>
          <tr><th>Zadato</th><th>Odgovor</th></tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
      <div class="reveal-points">
        Poeni runde: <strong>${earned}</strong><br>
        Ukupno u igri: <strong>${gameScore}</strong>
      </div>
    `,
    totalScore: GameEngine.getTotalScore() + gameScore,
    buttonText: roundNumber < TOTAL_ROUNDS
      ? "Sledeća runda"
      : "Sledeća igra",
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
      reason: "SINONIMI",
      silent: true
    });

    GameEngine.saveGameHighScore("sinonimi", gameScore);
    GameEngine.nextGame();
  }
}




  return { init };
})();
