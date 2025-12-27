// ======================================
// GLOBAL USER INFO
// ======================================
window.currentUser = null;
window.currentProfile = null;

const UIScreens = (() => {

  

  /* ======================================
       END GAME
  ====================================== */
  function showEndGame(data) {
    showReveal({
      title: "REZULTAT",
      message: data?.reason || "",
      totalScore: GameEngine.getTotalScore(),
      buttonText: "Sledeća igra",
      onNext: () => GameEngine.nextGame()
    });
  }

  /* ======================================
       UNIVERSAL REVEAL
  ====================================== */
  function showReveal({
    title = "REZULTAT",
    message = "",
    totalScore = 0,
    buttonText = "Sledeća igra",
    onNext = null
  }) {
    const screen = document.getElementById("screen");

    screen.innerHTML = `
      <div class="home-panel">
        <h2 class="home-title">${title}</h2>
        ${message ? `<p class="reveal-message">${message}</p>` : ""}
        <div class="reveal-score">
          Ukupan skor: <strong>${totalScore}</strong>
        </div>
        <button class="neon-btn" id="revealNextBtn">${buttonText}</button>
      </div>
    `;

    document.getElementById("revealNextBtn").onclick = () => {
      if (onNext) onNext();
    };
  }

  /* ======================================
       END MATCH
  ====================================== */
  function showEndMatch(data) {
    const screen = document.getElementById("screen");

    screen.innerHTML = `
      <div class="home-panel">
        <h2 class="home-title">MATCH ZAVRŠEN</h2>
        <p style="text-align:center;">Ukupan skor: <strong>${data.totalScore}</strong></p>
        <p style="text-align:center;">Najbolji skor: <strong>${data.bestScore}</strong></p>
        <button class="neon-btn" id="backHomeBtn">Početna</button>
      </div>
    `;

    document.getElementById("backHomeBtn").onclick = HomeScreen.show;
  }

  /* ======================================
       LOCAL HIGH SCORE
  ====================================== */
  function showHighScore() {
    const scores = JSON.parse(localStorage.getItem("quiz_game_highscores")) || {};
    const screen = document.getElementById("screen");

    const labels = {
      asocijacije: "Asocijacije",
      sinonimi: "Sinonimi / Antonimi",
      jezici: "Strane reči",
      matematika: "Matematika",
      opste: "Opšte znanje",
      geografija: "Geografija",
      izreke: "Izreke i Citati"
    };

    screen.innerHTML = `
      <div class="home-panel">
        <h2 class="home-title">High Score</h2>
      <div class="score-table">
  ${Object.keys(labels).map(k => `
    <div class="score-row ${scores[k] ? "has-score" : ""}">
      <span class="score-label">${labels[k]}</span>
      <strong class="score-value">${scores[k] || 0}</strong>
    </div>
  `).join("")}
</div>

        <button class="neon-btn secondary" onclick="HomeScreen.show()">← Nazad</button>
      </div>
    `;
  }

  /* ======================================
       ONLINE RANK LIST
  ====================================== */
function showRankList() {
  const screen = document.getElementById("screen");

  let visibleCount = 10; // 👈 TOP 10 po defaultu

  fetch(`${API.url}/leaderboard_best?order=best_score.desc&limit=1000`, {
    headers: {
      apikey: API.key,
      Authorization: `Bearer ${API.key}`
    }
  })
    .then(r => r.json())
    .then(list => {
      function render() {
        const visible = list.slice(0, visibleCount);

        screen.innerHTML = `
          <div class="home-panel">
            <h2 class="home-title">Online rang lista</h2>

            <div class="score-table">
              ${visible.map((e, i) => `
                <div class="score-row has-score ${i === 0 ? "rank-first" : ""}">
                  <span class="score-label">#${i + 1} ${e.player}</span>
                  <strong class="score-value">${e.best_score}</strong>
                </div>
              `).join("")}
            </div>

            ${
              list.length > visibleCount
                ? `<button id="loadMoreBtn" class="neon-btn secondary">
                     Vidi još
                   </button>`
                : ""
            }

            <button class="neon-btn secondary" onclick="HomeScreen.show()">
              ← Nazad
            </button>
          </div>
        `;

        const btn = document.getElementById("loadMoreBtn");
        if (btn) {
          btn.onclick = () => {
            visibleCount += 10; // 👈 još 10 svaki put
            render();
          };
        }
      }

      render();
    });
}


  /* ======================================
       LOGIN
  ====================================== */
function showLogin() {
  const screen = document.getElementById("screen");

  // 1️⃣ RENDER HTML
  screen.innerHTML = `
    <div class="home-panel auth-panel">
      <h2 class="home-title">Login</h2>

      <input id="loginEmail" class="asoc-input" type="email" placeholder="Email">

      <div class="password-field">
        <input id="loginPassword" class="asoc-input" type="password" placeholder="Password">
        <button type="button" class="toggle-password" id="toggleLoginPassword">👁</button>
      </div>

      <button class="neon-btn" id="loginDo">Login</button>

      <div class="auth-links">
        <span id="forgotPass">Forgot password?</span>
        <span id="goRegister">Nemate nalog? Sign up</span>
      </div>

      <button class="neon-btn secondary" onclick="HomeScreen.show()">← Nazad</button>
    </div>
  `;

  // 2️⃣ 👁 SHOW / HIDE PASSWORD  ← OVO JE KLJUČNO
  const passInput = document.getElementById("loginPassword");
  const toggleBtn = document.getElementById("toggleLoginPassword");

  if (passInput && toggleBtn) {
    toggleBtn.onclick = () => {
      const hidden = passInput.type === "password";
      passInput.type = hidden ? "text" : "password";
      toggleBtn.textContent = hidden ? "🙈" : "👁";
    };
  }

  // 3️⃣ LOGIN LOGIKA (TVOJ POSTOJEĆI KOD)
  document.getElementById("loginDo").onclick = async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      alert("Popunite sva polja");
      return;
    }

    const { data, error } =
      await window.sb.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
      return;
    }

    window.currentUser = data.user;

    const { data: profile } = await window.sb
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    window.currentProfile = profile;

    if (window.updateMenuAuth) updateMenuAuth();
    HomeScreen.show();
  };

  // 4️⃣ LINKOVI
  forgotPass.onclick = showForgotPassword;
  goRegister.onclick = showRegister;
}


  /* ======================================
       REGISTER
  ====================================== */
function showRegister() {
  const screen = document.getElementById("screen");

  screen.innerHTML = `
    <div class="home-panel auth-panel">
      <h2 class="home-title">Sign up</h2>

      <input id="regUsername" class="asoc-input" placeholder="Username">
      <input id="regEmail" class="asoc-input" type="email" placeholder="Email">

      <div class="password-field">
        <input id="regPass1" class="asoc-input" type="password" placeholder="Password">
        <button type="button" class="toggle-password" id="toggleRegPass1">👁</button>
      </div>

      <div class="password-field">
        <input id="regPass2" class="asoc-input" type="password" placeholder="Confirm password">
        <button type="button" class="toggle-password" id="toggleRegPass2">👁</button>
      </div>

      <button class="neon-btn" id="registerDo">Create account</button>

      <div class="auth-links">
        <span id="backToLogin">Already have account? Login</span>
      </div>
    </div>
  `;

  const bindToggle = (inputId, btnId) => {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (!input || !btn) return;

    btn.onclick = () => {
      const hidden = input.type === "password";
      input.type = hidden ? "text" : "password";
      btn.textContent = hidden ? "🙈" : "👁";
    };
  };

  bindToggle("regPass1", "toggleRegPass1");
  bindToggle("regPass2", "toggleRegPass2");

  registerDo.onclick = async () => {
    if (regPass1.value !== regPass2.value) {
      alert("Lozinke se ne poklapaju");
      return;
    }

    const { error } = await Auth.signup(
      regEmail.value,
      regPass1.value,
      regUsername.value
    );

    if (error) {
      alert(error.message);
      return;
    }

    alert("Registracija uspešna");
    showLogin();
  };

  backToLogin.onclick = showLogin;
}


  /* ======================================
       FORGOT PASSWORD
  ====================================== */
  function showForgotPassword() {
    const screen = document.getElementById("screen");

    screen.innerHTML = `
      <div class="home-panel auth-panel">
        <h2 class="home-title">Reset password</h2>
        <input id="resetEmail" class="asoc-input" type="email" placeholder="Email">
        <button class="neon-btn" id="resetDo">Pošalji reset link</button>
        <div class="auth-links">
          <span id="backToLogin">Nazad na Login</span>
        </div>
      </div>
    `;

    resetDo.onclick = async () => {
      const { error } = await window.sb.auth.resetPasswordForEmail(
        resetEmail.value,
        { redirectTo: window.location.origin }
      );

      if (error) {
        alert(error.message);
        return;
      }

      alert("Email za reset je poslat");
      showLogin();
    };

    backToLogin.onclick = showLogin;
  }

  /* ======================================
       RESET PASSWORD
  ====================================== */
function showResetPassword() {
  const screen = document.getElementById("screen");

  screen.innerHTML = `
    <div class="home-panel auth-panel">
      <h2 class="home-title">New password</h2>

      <div class="password-field">
        <input id="newPass1" class="asoc-input" type="password" placeholder="New password">
        <button type="button" class="toggle-password" id="toggleNewPass1">👁</button>
      </div>

      <div class="password-field">
        <input id="newPass2" class="asoc-input" type="password" placeholder="Confirm password">
        <button type="button" class="toggle-password" id="toggleNewPass2">👁</button>
      </div>

      <button class="neon-btn" id="confirmReset">Set password</button>
    </div>
  `;

  const bindToggle = (inputId, btnId) => {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (!input || !btn) return;

    btn.onclick = () => {
      const hidden = input.type === "password";
      input.type = hidden ? "text" : "password";
      btn.textContent = hidden ? "🙈" : "👁";
    };
  };

  bindToggle("newPass1", "toggleNewPass1");
  bindToggle("newPass2", "toggleNewPass2");

  confirmReset.onclick = async () => {
    if (newPass1.value !== newPass2.value) {
      alert("Lozinke se ne poklapaju");
      return;
    }

    const { error } = await window.sb.auth.updateUser({
      password: newPass1.value
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Lozinka promenjena");
    HomeScreen.show();
  };
}


  /* ======================================
       LOAD USER ON START
  ====================================== */
  async function loadUserProfile() {
    if (!window.sb?.auth) return;

    const { data } = await window.sb.auth.getUser();
    if (!data?.user) return;

    window.currentUser = data.user;

    const { data: profile } = await window.sb
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    window.currentProfile = profile;

    if (window.updateMenuAuth) updateMenuAuth();
  }

  
  loadUserProfile();


  /* ===============================
   STATIC PAGES
=============================== */

function showAbout() {
  const screen = document.getElementById("screen");
  screen.innerHTML = window.renderAbout();
}

function showRules() {
  const screen = document.getElementById("screen");
  screen.innerHTML = window.renderRules();
}

function showContact() {
  const screen = document.getElementById("screen");
  screen.innerHTML = window.renderContact();
}

function showPrivacy() {
  const screen = document.getElementById("screen");
  screen.innerHTML = window.renderPrivacy();
}

function showSupport() {
  const screen = document.getElementById("screen");
  screen.innerHTML = window.renderSupport();
}


  

  
  return {
    showEndGame,
    showEndMatch,
    showHighScore,
    showReveal,
    showRankList,
    showLogin,
    showRegister,
    showForgotPassword,
    showResetPassword,
    showAbout,
    showRules,
    showContact,
    showPrivacy,
    showSupport
  };

})();

window.UIScreens = UIScreens;

/* ======================================
   PASSWORD RECOVERY LISTENER
====================================== */
if (window.sb?.auth) {
  window.sb.auth.onAuthStateChange((event) => {
    if (event === "PASSWORD_RECOVERY") {
      UIScreens.showResetPassword();
    }
  });
}

function showHome() {
  HomeScreen.show();
}









