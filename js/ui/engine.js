// js/ui/engine.js
/* ======================================
   QUIZ ARENA – GAME ENGINE
====================================== */

const GameEngine = (() => {

  const state = {
    currentGame: 1,
    totalGames: 7,
    currentPlayer: 1,

    scores: { 1: 0, 2: 0 },
    totalScore: 0,
    gameRunning: false,

    

    session: null

    
  };
   let onTick = null;
   let onTimeEnd = null;

  /* ==========================
     CORE
  ========================== */

  function startGame(gameNumber) {

    // Kreiraj sesiju ako ne postoji
    if (!state.session && window.Connect) {
      state.session = Connect.getSession();
      console.log("🔗 SESSION:", state.session);
    }

    state.currentGame = gameNumber;
    state.gameRunning = true;

    console.log(`▶ START GAME ${gameNumber}`);
    Router.loadGame(gameNumber);
  }

function finish(result = {}) {
  if (!state.gameRunning) return;

  state.gameRunning = false;

  const points = result.points || 0;
  const winner = result.winner || 1;

  state.scores[winner] += points;
  state.totalScore += points;

  console.log("■ GAME FINISHED", result);
  console.log("TOTAL SCORE:", state.totalScore);
}



  function nextGame() {
    if (state.currentGame >= state.totalGames) {
      endMatch();
    } else {
      startGame(state.currentGame + 1);
    }
  }

  function endMatch() {

    console.log("🏁 MATCH FINISHED", {
      session: state.session,
      totalScore: state.totalScore,
      scores: state.scores
    });

    if (state.totalScore > 0) {
      saveGameHighScore(state.totalScore);
      sendSessionToBackend();
    }

    const best = Number(localStorage.getItem("quizarena_best") || 0);
    if (state.totalScore > best) {
      localStorage.setItem("quizarena_best", state.totalScore);
    }

    if (window.UIScreens?.showEndMatch) {
      UIScreens.showEndMatch({
        scores: state.scores,
        totalScore: state.totalScore,
        bestScore: Math.max(best, state.totalScore)
      });
    }
      /* =========================
     🔥 HARD RESET MATCH STATE
  ========================= */
  state.currentGame = 1;
  state.gameRunning = false;
  state.totalScore = 0;
  state.scores = { 1: 0, 2: 0 };
  state.session = null;

  console.log("🧹 MATCH STATE RESET");
    state.session = null; // reset sesije
  }

  


  /* ==========================
     BACKEND (SUPABASE)
  ========================== */

function sendSessionToBackend() {

  // ⛔ Guest ne šalje online score
  if (!window.currentProfile && !window.currentUser) {
    console.log("⛔ Guest session not sent online");
    return;
  }

  const playerName =
    window.currentProfile?.username ||
    window.currentUser?.email;

  const payload = {
    player: playerName,
    score: state.totalScore,
    endAt: Date.now()
  };

  console.log("📤 SEND TO SERVER:", payload);

  API.addScore(payload)
    .then(() => console.log("✅ SCORE SAVED ONLINE"))
    .catch(err => console.error("❌ ONLINE SCORE ERROR:", err));
}


  /* ==========================
     HIGHSCORE (LOCAL)
  ========================== */


function saveHighScore(total) {
  if (typeof total !== "number" || total <= 0) return;

  const key = "quiz_highscores"; // ✅ SAMO za MEČEVE
  let list = JSON.parse(localStorage.getItem(key) || "[]");

  if (!Array.isArray(list)) list = []; // 🛡 sigurnosno

  const entry = {
    name:
      window.currentProfile?.username ||
      window.currentUser?.email ||
      "Guest",
    score: total,
    date: new Date().toLocaleDateString("sr-RS"),
    time: new Date().toLocaleTimeString("sr-RS")
  };

  list.push(entry);
  list.sort((a, b) => b.score - a.score);

  localStorage.setItem(key, JSON.stringify(list.slice(0, 20)));
  console.log("✅ MATCH HighScore sačuvan:", entry);
}


function saveGameHighScore(gameKey, score) {
  if (!gameKey || typeof score !== "number") return;

  const key = "quiz_game_highscores";
  const data = JSON.parse(localStorage.getItem(key)) || {};

  if (!data[gameKey] || score > data[gameKey]) {
    data[gameKey] = score;
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`🏆 NEW BEST [${gameKey}]:`, score);
  }
}




  /* ==========================
     API
  ========================== */

return {
  startGame,
  finish,
  nextGame,
  endMatch,
  saveGameHighScore,   // ⬅️ DODAJ
  getState: () => JSON.parse(JSON.stringify(state)),
  getTotalScore: () => state.totalScore
};


})();

window.GameEngine = GameEngine;
console.log("ENGINE LOADED ✅", GameEngine);
