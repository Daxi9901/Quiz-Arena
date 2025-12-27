// GAME 3 – Strane reči (proporcionalno bodovanje)

const Game3 = (() => {

  let allData = [];
  let dataQueue = [];
  let dataIndex = 0;

  let activeIndex = null; // ⬅️ trenutno izabrano polje

  let current = null;
  let roundIndex = 0;
  let roundFinished = false;

  const TOTAL_ROUNDS = 2;

  let answers = [];
  let filledIndex = 0;

  let timer = 60;
  let timerInterval = null;

  let score = 0;
  let roundScore = 0;

  const MAX_POINTS_PER_ROUND = 25;
  const PERFECT_BONUS = 0;

const LANG_MAP = {
  en: "Engleski",
  de: "Nemački",
  fr: "Francuski",
  es: "Španski",
  it: "Italijanski"
};



  /* ===============================
     INIT
  =============================== */
  async function init() {
    stopTimer();

    roundIndex = 0;
    score = 0;
    timer = 60;

    if (allData.length === 0) {
  const res = await fetch("data/strani_jezici.json");
  allData = await res.json();
}

resetQueue(); // 🔥 UVEK novi ciklus igre = nova queue

    startTimer();
    loadRound();
  }

  /* ===============================
     QUEUE
  =============================== */
function resetQueue() {
  dataQueue = shuffle([...allData]); // 🔀 promesaj SVE
  dataIndex = 0;
}

function getNext() {
  if (dataQueue.length === 0 || dataIndex >= dataQueue.length) {
    resetQueue(); // tek kad se ISTROŠI
  }
  return dataQueue[dataIndex++];
}


  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ===============================
     TIMER
  =============================== */
  function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
      timer--;
      updateTimer();
      if (timer <= 0) finishRound(false);
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }

  function updateTimer() {
    const el = document.getElementById("timer");
    if (el) el.textContent = timer;
  }

  /* ===============================
     LOAD ROUND
  =============================== */
function loadRound() {
  stopTimer();          // ⬅️ SIGURNOSNO

  roundFinished = false;

  if (roundIndex >= TOTAL_ROUNDS) {
    endGame();
    return;
  }

  current = getNext();
  roundScore = 0;
  timer = 60;

  answers = Array(current.missing.length).fill("");
  activeIndex = 0;


  render();
  startTimer();         // ⬅️ JEDINO MESTO GDE SE STARTUJE
}



  /* ===============================
     RENDER (PLAY ONLY)
  =============================== */
function render() {
  const screen = document.getElementById("screen");
  const liveScore = GameEngine.getTotalScore() + score;

  const parts = current.text.split("___");
  let sentenceHTML = "";

  parts.forEach((p, i) => {
    sentenceHTML += `<span>${p}</span>`;

    if (i < answers.length) {
      sentenceHTML += `
        <span class="blank-slot
          ${answers[i] ? "filled" : ""}
          ${activeIndex === i ? "active" : ""}"
          data-index="${i}">
          ${answers[i] || "_____"}
        </span>
      `;
    }
  });

  screen.innerHTML = `
    <div class="home-panel">

      <div class="game-header">
        <div class="game-title">Strane reči</div>
        <div class="game-stats">
          <span>⏱ <span id="timer">${timer}</span>s</span>
          <span>⭐ ${liveScore}</span>
        </div>
      </div>

      <div class="sentence-box">
        ${sentenceHTML}
      </div>

      <div class="options-box">
        ${current.options.map(o => `
          <button class="option-btn">${o}</button>
        `).join("")}
      </div>

      <div class="game-buttons">
        <button id="checkBtn" class="neon-btn">Potvrdi</button>
        <button id="giveUpBtn" class="neon-btn secondary">Odustani</button>
      </div>

    </div>
  `;

  /* ===============================
     BLANK SLOT CLICK
  =============================== */
  document.querySelectorAll(".blank-slot").forEach(slot => {
    slot.onclick = () => {
      activeIndex = Number(slot.dataset.index);
      render();
    };
  });

  /* ===============================
     OPTION BUTTONS
  =============================== */
  document.querySelectorAll(".option-btn").forEach(btn => {
    btn.onclick = () => pickWord(btn);
  });

  /* ===============================
     ACTION BUTTONS
  =============================== */
  document.getElementById("checkBtn").onclick = () => {
    if (!answers.some(a => a)) return;
    finishRound(true);
  };

  document.getElementById("giveUpBtn").onclick = () => finishRound(false);
}


  function buildRevealSentence() {
  const parts = current.text.split("___");
  let html = "";

  parts.forEach((p, i) => {
    html += `<span>${p}</span>`;

    if (i < current.missing.length) {
      const userAnswer = answers[i];
      const correct = current.missing[i];

      let cls = "reveal-empty";
      let content = correct;

      if (userAnswer) {
        if (userAnswer.toLowerCase() === correct.toLowerCase()) {
          cls = "reveal-correct";
          content = userAnswer;
        } else {
          cls = "reveal-wrong";
          content = `${userAnswer} → ${correct}`;
        }
      }

      html += `<span class="reveal-blank ${cls}">${content}</span>`;
    }
  });

  return html;
}


  /* ===============================
     PICK WORD
  =============================== */
function pickWord(btn) {
  if (activeIndex === null) return;

  // ako već postoji reč u slotu → oslobodi staro dugme
  const old = answers[activeIndex];
  if (old) {
    document.querySelectorAll(".option-btn").forEach(b => {
      if (b.textContent === old) b.disabled = false;
    });
  }

  answers[activeIndex] = btn.textContent;
  btn.disabled = true;

  // automatski pređi na sledeći prazan slot (UX 🔥)
  const nextEmpty = answers.findIndex(a => !a);
  activeIndex = nextEmpty !== -1 ? nextEmpty : null;

  render();
}



  /* ===============================
     FINISH ROUND → UNIVERSAL REVEAL
  =============================== */
  function finishRound(check) {
    if (roundFinished) return;
  roundFinished = true;
    stopTimer();

    let correctCount = 0;

    if (check) {
      for (let i = 0; i < answers.length; i++) {
        if (
          answers[i].toLowerCase() ===
          current.missing[i].toLowerCase()
        ) {
          correctCount++;
        }
      }
    }

    roundScore = 0;

    if (check && correctCount > 0) {
      const accuracy = correctCount / answers.length;
      roundScore = Math.round(accuracy * MAX_POINTS_PER_ROUND);

      if (correctCount === answers.length) {
        roundScore += PERFECT_BONUS;
      }
    }

    score += roundScore;

    const isLastRound = roundIndex + 1 >= TOTAL_ROUNDS;

const message = `
  <div><strong>Jezik:</strong> ${LANG_MAP[current.lang] || current.lang}</div>
  <br>
  <div><strong>Rečenica:</strong> ${current.full}</div>
  <div style="opacity:.85">${current.translation}</div>
`;



const revealSentence = buildRevealSentence();

UIScreens.showReveal({
  title: correctCount === answers.length ? "SAVRŠENO!" : "STRANE REČI",
  message: `
    <div><strong>Jezik:</strong> ${LANG_MAP[current.lang] || current.lang}</div>
    <br>

    <div class="reveal-sentence">
      ${revealSentence}
    </div>

    <div style="opacity:.85; margin-top:10px;">
      ${current.translation}
    </div>

   <div class="reveal-points">
  Poeni runde: <strong>${roundScore}</strong><br>
  Ukupno u igri: <strong>${score}</strong>
</div>

  `,
  totalScore: GameEngine.getTotalScore() + score,
  buttonText: isLastRound ? "Sledeća igra" : "Sledeća runda",
  onNext: () => {
  stopTimer();          // ⬅️ UBICA ZOMBI TAJMERA
  roundFinished = false;
  roundIndex++;
  timer = 60;
  loadRound();          // ⬅️ loadRound ĆE SAM DA STARTUJE TIMER
}

});

  }

  /* ===============================
     END GAME
  =============================== */
function endGame() {
  stopTimer(); // ⬅️ KLJUČNA LINIJA

  GameEngine.finish({
    winner: 1,
    points: score,
    reason: "STRANE REČI",
    silent: true
  });

  GameEngine.saveGameHighScore("jezici", score);
  GameEngine.nextGame();
}


  return { init };
})();
