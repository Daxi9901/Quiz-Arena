window.renderContact = function () {
  return `
    <div class="home-panel">
      <h2 class="home-title">Kontakt</h2>

      <p style="line-height:1.7; margin-bottom:14px;">
        Ukoliko imate pitanja, predloge, prijavu greške ili ideje
        za unapređenje Quiz Arena aplikacije, slobodno nas kontaktirajte.
      </p>

      <p style="line-height:1.7; margin-bottom:14px;">
        Povratne informacije korisnika su važne jer direktno
        doprinose razvoju novih igara, poboljšanju postojećih
        funkcionalnosti i ukupnom kvalitetu platforme.
      </p>

      <p style="line-height:1.7; margin-bottom:18px;">
        Kontakt trenutno možete ostvariti putem email adrese:
        <br>
        <strong style="color:#b88cff;">darkozavisic19@gmail.com</strong>
      </p>

      <p style="font-size:13px; opacity:0.75; margin-bottom:18px;">
        Trudimo se da odgovorimo u najkraćem mogućem roku.
      </p>

      <button class="neon-btn secondary" onclick="HomeScreen.show()">
        ← Nazad
      </button>
    </div>
  `;
};
