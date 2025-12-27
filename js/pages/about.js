window.renderAbout = function () {
  return `
    <div class="home-panel">
      <h2 class="home-title">O aplikaciji</h2>

      <p style="line-height:1.7; margin-bottom:14px;">
        Quiz Arena je interaktivna kviz platforma namenjena učenju,
        zabavi i mentalnom razvoju. Aplikacija kombinuje različite
        tipove igara i pitanja kako bi korisnicima pružila
        dinamično i zanimljivo iskustvo.
      </p>

      <p style="line-height:1.7; margin-bottom:14px;">
        Kroz više tematskih kategorija, vremenska ograničenja
        i sistem bodovanja, Quiz Arena podstiče brzo razmišljanje,
        koncentraciju i proširivanje znanja na pristupačan način.
      </p>

      <p style="line-height:1.7; margin-bottom:18px;">
        Platforma je razvijena kao nezavisan projekat i stalno se
        unapređuje kroz dodavanje novih igara, pitanja i
        funkcionalnosti, sa ciljem da ostane jednostavna,
        stabilna i dostupna svim korisnicima.
      </p>

      <button class="neon-btn secondary" onclick="HomeScreen.show()">
        ← Nazad
      </button>
    </div>
  `;
};
