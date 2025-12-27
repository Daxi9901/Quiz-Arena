// ==========================================
// CONNECT MODULE (local player + session)
// ==========================================
const Connect = (() => {
  const KEY = "quiz_player";
  const SESSION_KEY = "quiz_session";

  function getPlayer() {
    return localStorage.getItem(KEY);
  }

  function setPlayer(name) {
    if (!name || !name.trim()) return false;
    localStorage.setItem(KEY, name.trim());
    localStorage.removeItem(SESSION_KEY);
    return true;
  }

  function clearPlayer() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  function getSession() {
    let session = localStorage.getItem(SESSION_KEY);
    if (session) return JSON.parse(session);

    const newSession = {
      sessionId: crypto.randomUUID(),
      player: getPlayer(),
      startedAt: Date.now()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    return newSession;
  }

  return {
    getPlayer,
    setPlayer,
    clearPlayer,
    getSession
  };
})();

// global
window.Connect = Connect;
console.log("CONNECT LOADED ✅", Connect);

// ==========================================
// SUPABASE CLIENT (Auth + DB)  ✅ KLJUČNO
// ==========================================
// Moraš imati u index.html:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

window.SUPABASE_URL = "https://igeivenvwagoxcywdzsm.supabase.co";
window.SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnZWl2ZW52d2Fnb3hjeXdkenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTM2ODIsImV4cCI6MjA4MDk4OTY4Mn0.na_e_JBYeI2yVZgu8BBNUjO47y7zswLwvhPscGGX1v0";

// Ne zovi ovo "supabase" da ne pregažiš CDN namespace.
window.sb = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
console.log("SUPABASE CLIENT READY ✅", window.sb);

// ==========================================
// SUPABASE REST API MODULE (scores/leaderboard)
// ==========================================
window.API = {
  url: "https://igeivenvwagoxcywdzsm.supabase.co/rest/v1",
  key: window.SUPABASE_ANON_KEY,

  async addScore(entry) {
    try {
      const res = await fetch(`${this.url}/scores`, {
        method: "POST",
        headers: {
          apikey: this.key,
          Authorization: `Bearer ${this.key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify(entry)
      });

      if (!res.ok) {
        console.warn("❌ GREŠKA PRI UPISU:", await res.text());
      }

      return res;
    } catch (err) {
      console.error("❌ NETWORK ERROR:", err);
    }
  },

  async getLeaderboard(limit = 30) {
    const url =
      `${this.url}/scores?select=player,score,created_at,endAt` +
      `&order=score.desc&limit=${limit}`;

    const res = await fetch(url, {
      headers: {
        apikey: this.key,
        Authorization: `Bearer ${this.key}`
      }
    });

    if (!res.ok) {
      console.error("❌ API ERROR:", await res.text());
      return [];
    }

    const data = await res.json();
    return data.map((item) => ({
      ...item,
      dateFormatted: new Date(Number(item.endAt)).toLocaleString("sr-RS")
    }));
  }
};

console.log("API LOADED ✅", window.API);

// ==========================================
// MENU BINDINGS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("sideMenu");

  const userBox = document.getElementById("menuUserBox");
  const usernameEl = document.getElementById("menuUsername");
  const authBtn = document.getElementById("menuAuthBtn");

  hamburger.onclick = (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
  };

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
      menu.classList.remove("open");
    }
  });

  function updateMenuAuth() {
    if (window.currentUser && window.currentProfile) {
      userBox.classList.remove("hidden");
      usernameEl.textContent = window.currentProfile.username || "";
      authBtn.textContent = "Logout";
      authBtn.classList.add("logout");
    } else {
      userBox.classList.add("hidden");
      usernameEl.textContent = "";
      authBtn.textContent = "Login";
      authBtn.classList.remove("logout");
    }
  }

  window.updateMenuAuth = updateMenuAuth;

  const bind = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.onclick = fn;
  };

  bind("menuHome", () => {
    menu.classList.remove("open");
    HomeScreen.show();
  });

  bind("menuStart", () => {
    menu.classList.remove("open");
   GameEngine.startGame(1);
});

  bind("menuHighscore", () => {
    menu.classList.remove("open");
    UIScreens.showHighScore();
  });

  bind("menuRank", () => {
    menu.classList.remove("open");
    UIScreens.showRankList();
  });

 bind("menuAbout", () => {
  menu.classList.remove("open");
  UIScreens.showAbout();
});


  bind("menuAuthBtn", async () => {
    menu.classList.remove("open");

    if (window.currentUser) {
      await Auth.logout();
      window.currentUser = null;
      window.currentProfile = null;
      updateMenuAuth();
      HomeScreen.show();
    } else {
      UIScreens.showLogin();
    }
  });

  updateMenuAuth();
});
