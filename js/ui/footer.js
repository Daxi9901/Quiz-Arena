console.log("FOOTER JS LOADED ✅");

document.addEventListener("DOMContentLoaded", () => {

  // ⬇⬇⬇ OVDE SE FOOTER FIZIČKI UBACUJE U DOM
  if (!document.querySelector(".app-footer")) {
    document.body.insertAdjacentHTML("beforeend", `
      <footer class="app-footer">
        <div class="footer-inner">

          <div class="footer-left">
            <span class="footer-logo">QUIZ ARENA</span>
            <span class="footer-copy">© 2025</span>
          </div>

          <div class="footer-center">
            <button id="footerAbout">O aplikaciji</button>
            <button id="footerRules">Pravila</button>
            <button id="footerContact">Kontakt</button>
            <button id="footerPrivacy">Privatnost</button>
          </div>

          <div class="footer-right">
            <a href="#" id="footerSupport" class="support-link">💜 Support</a>
          </div>

        </div>
      </footer>
    `);
  }

});


document.addEventListener("DOMContentLoaded", () => {

  if (!window.UIScreens) {
    console.warn("UIScreens not ready yet");
    return;
  }

  const bind = (id, fn) => {
    const el = document.getElementById(id);
    if (!el) {
      console.warn("Footer element not found:", id);
      return;
    }
    el.onclick = fn;
  };

  bind("footerAbout", () => {
    UIScreens.showAbout();
  });

  bind("footerRules", () => {
    UIScreens.showRules();
  });

  bind("footerContact", () => {
    UIScreens.showContact?.();
  });

  bind("footerPrivacy", () => {
    UIScreens.showPrivacy?.();
  });

  bind("footerSupport", (e) => {
    e.preventDefault();
    UIScreens.showSupport?.();
  });

});

(function initMobileFooterObserver() {
  const footer = document.querySelector(".app-footer");
  const sentinel = document.getElementById("footer-sentinel");

  if (!footer || !sentinel) return;
  if (window.innerWidth > 480) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          footer.classList.add("visible");
        } else {
          footer.classList.remove("visible");
        }
      });
    },
    {
      root: null,
      threshold: 0.1
    }
  );

  observer.observe(sentinel);
})();



