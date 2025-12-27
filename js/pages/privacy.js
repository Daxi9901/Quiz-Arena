window.renderPrivacy = function () {
  return `
    <div class="home-panel">
      <h2 class="home-title">Politika privatnosti</h2>

      <p style="line-height:1.7; margin-bottom:14px;">
        Privatnost korisnika je važna i Quiz Arena je dizajnirana
        tako da prikuplja minimalnu količinu podataka neophodnih
        za funkcionisanje aplikacije.
      </p>

      <p style="line-height:1.7; margin-bottom:14px;">
        Aplikacija ne prikuplja lične podatke bez saglasnosti
        korisnika. Podaci kao što su rezultati igara i statistika
        koriste se isključivo u svrhu rangiranja i unapređenja
        korisničkog iskustva.
      </p>

      <p style="line-height:1.7; margin-bottom:14px;">
        Ukoliko se koristi nalog za prijavu, osnovni podaci
        neophodni za autentifikaciju čuvaju se bezbedno
        i ne dele se sa trećim licima.
      </p>

      <p style="line-height:1.7; margin-bottom:14px;">
        Quiz Arena ne prodaje, ne iznajmljuje i ne deli korisničke
        podatke sa trećim stranama u marketinške ili komercijalne
        svrhe.
      </p>

      <p style="line-height:1.7; margin-bottom:14px;">
        Podaci se mogu koristiti u anonimnom obliku radi
        analize performansi aplikacije, otklanjanja grešaka
        i poboljšanja stabilnosti sistema.
      </p>

      <p style="font-size:13px; opacity:0.75; margin-bottom:18px;">
        Korišćenjem Quiz Arena aplikacije prihvatate ovu
        politiku privatnosti.
      </p>

      <button class="neon-btn secondary" onclick="HomeScreen.show()">
        ← Nazad
      </button>
    </div>
  `;
};
