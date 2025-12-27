window.renderSupport = function () {
  return `
    <div class="home-panel">
      <h2 class="home-title">Support</h2>

      <p style="line-height:1.7; margin-bottom:14px;">
        Quiz Arena je nezavisna, besplatna i stalno razvijana
        kviz platforma namenjena učenju, zabavi i mentalnom treningu.
        Sav sadržaj i funkcionalnosti razvijaju se kontinuirano,
        sa ciljem da aplikacija bude kvalitetnija, stabilnija i bogatija.
      </p>

      <p style="line-height:1.7; margin-bottom:14px;">
        Ukoliko želite da podržite dalji razvoj projekta, unapređenje
        postojećih igara i dodavanje novih funkcionalnosti,
        to možete učiniti dobrovoljnom donacijom.
        Svaka podrška direktno doprinosi održavanju i razvoju platforme.
      </p>

      <p style="line-height:1.7; margin-bottom:20px;">
        Podrška nije obavezna – Quiz Arena će uvek ostati dostupna
        svim korisnicima. Donacije služe isključivo kao pomoć
        za dalji rad, hosting, razvoj i poboljšanje korisničkog iskustva.
      </p>

<button
  class="neon-btn support-paypal-btn"
  onclick="window.open('https://paypal.me/daxi990', '_blank')"
>
  💜 Podrži razvoj putem PayPal-a
</button>
        <br/><br/>

      <p style="opacity:0.7; font-size:13px; margin-bottom:16px;">
        Hvala vam što koristite Quiz Arena i što ste deo ove zajednice.
      </p>

      <button class="neon-btn secondary" onclick="HomeScreen.show()">
        ← Nazad
      </button>
    </div>
  `;
};
