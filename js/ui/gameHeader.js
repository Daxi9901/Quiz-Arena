window.renderGameHeader = function (title, timer, score) {
  return `
    <div class="game-header">
      <div class="game-title">${title}</div>
      <div class="game-stats">
        <span id="gameTimer">${timer}s</span>
        <span class="stat-score">⭐ <span id="gameScore">${score}</span></span>
      </div>
    </div>
  `;
};
