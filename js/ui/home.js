// js/ui/home.js

const HomeScreen = (() => {

  /* ============================================================
     HOME SCREEN
  ============================================================ */
  function show() {
    const screen = document.getElementById("screen");

    const isLoggedIn = !!window.currentUser;
    const username = window.currentProfile?.username || "";

    screen.innerHTML = `
      <div class="home-panel">

          ${
            isLoggedIn
              ? `<div class="user-info">
                   Ulogovan kao:
                   <strong>${username}</strong>
                 </div>`
              : ``
          }

          <h1 class="home-title">QUIZ ARENA</h1>

          <div class="button-stack">
            <button id="startBtn" class="neon-btn">
              Start Game
            </button>

            <button id="scoreBtn" class="neon-btn">
              High Score
            </button>

            <button id="rankBtn" class="neon-btn">
              Rang Lista
            </button>

            <button
              id="authBtn"
              class="neon-btn ${isLoggedIn ? "danger" : ""}">
              ${isLoggedIn ? "Logout" : "Login / Register"}
            </button>
          </div>

        </div>
      </div>
    `;

    /* ================= ACTIONS ================= */

    document.getElementById("startBtn").onclick =
      () => GameEngine.startGame(1);

    document.getElementById("scoreBtn").onclick =
      () => UIScreens.showHighScore();

    document.getElementById("rankBtn").onclick =
      () => UIScreens.showRankList();

    const authBtn = document.getElementById("authBtn");

    if (isLoggedIn) {
      authBtn.onclick = async () => {
        await Auth.logout();
        window.currentUser = null;
        window.currentProfile = null;
        HomeScreen.show();
      };
    } else {
      authBtn.onclick = () => {
        UIScreens.showLogin();
      };
    }
  }

  return {
    show
  };

})();

window.HomeScreen = HomeScreen;
