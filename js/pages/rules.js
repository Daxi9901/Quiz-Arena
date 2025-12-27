window.renderRules = function () {
  return `
    <div class="home-panel">
      <h2 class="home-title">Pravila igre</h2>

      <p style="line-height:1.7; margin-bottom:16px;">
        Quiz Arena se sastoji od <strong>7 različitih igara</strong> koje se
        igraju uzastopno u okviru jednog meča. Cilj je da u svakoj igri
        ostvariš što veći broj poena u okviru zadatog vremena.
      </p>

      <ul style="line-height:1.7; margin-bottom:18px; text-align:left;">
        <li>Svaka igra ima vremensko ograničenje</li>
        <li>Poeni se sabiraju tokom celog meča</li>
        <li>Nema vraćanja na prethodne igre</li>
        <li>Brzina i tačnost donose bolji rezultat</li>
      </ul>

      <h3 style="margin-bottom:10px;">Tok igre</h3>

      <ol style="line-height:1.8; text-align:left; margin-bottom:20px;">
        <li>
          <strong>Asocijacije</strong><br>
          Dobijaš <strong>5 tragova</strong> i imaš <strong>60 sekundi</strong>
          da pogodiš konačno rešenje.
        </li>

        <li>
          <strong>Sinonimi i antonimi</strong><br>
          Igra se u <strong>2 runde</strong>. U svakoj rundi imaš
          <strong>5 reči</strong> koje treba da pogodiš u roku od
          <strong>60 sekundi</strong>.
        </li>

        <li>
          <strong>Dopuni rečenicu</strong><br>
          Dobijaš stranu rečenicu u kojoj nedostaju određene reči.
          Tvoj zadatak je da pronađeš <strong>tačnu reč među ponuđenima</strong>
          u roku od <strong>60 sekundi</strong>.
        </li>

        <li>
          <strong>Matematika</strong><br>
          Imaš <strong>60 sekundi</strong> da rešiš što više matematičkih
          zadataka.
        </li>

        <li>
          <strong>Opšte znanje</strong><br>
          U roku od <strong>60 sekundi</strong> odgovaraš na što veći broj
          pitanja iz različitih oblasti.
        </li>

        <li>
          <strong>Nabrajanje</strong><br>
          Na zadato slovo nabrajaš <strong>države, gradove, životinje
          i predmete</strong>. Svaki tačan unos donosi poene.
        </li>

        <li>
          <strong>Citati i izreke</strong><br>
          Dobijaš citat u kome nedostaje nekoliko reči koje treba da dopuniš.
          Imaš <strong>60 sekundi</strong>. Postoji opcija pomoći, ali
          <strong>korišćenje pomoći smanjuje broj poena</strong>.
        </li>
      </ol>

      <button class="neon-btn secondary" onclick="HomeScreen.show()">
        ← Nazad
      </button>
    </div>
  `;
};
