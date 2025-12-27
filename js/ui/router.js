const Router = (() => {

  function loadGame(gameNumber) {
    const screen = document.getElementById("screen");
    screen.innerHTML = "";

    switch (gameNumber) {
      case 1:
        Game1.init();
        break;
      case 2:
        Game2.init();
        break;
        case 3:
        Game3.init();
        break;
        case 4:
        Game4.init();
        break;
              case 5:
        Game5.init();
        break;
        case 6:
        Game6.init();
        break;
        case 7:
        Game7.init();
        break;
        
      default:
        
        screen.innerHTML = "<h2>Game not implemented</h2>";
    }
  }

  return {
    loadGame
  };

  window.addEventListener("load", () => {
  UIScreens.showHome();
});


})();


