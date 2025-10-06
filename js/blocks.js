const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: 180,
  y: 360,
  width: 40,
  height: 20,
  speed: 8 // Spieler schneller bewegen
};

const blocks = [];
const blockSize = 20;
let score = 0;
let gameOver = false;

// Block erzeugen
function createBlock() {
  if (!gameOver) {
    const x = Math.floor(Math.random() * (canvas.width - blockSize));
    blocks.push({ x: x, y: 0 });
  }
}

// Spiel rendern
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Spieler
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Blöcke
  ctx.fillStyle = "red";
  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i];
    block.y += 3; // Blöcke langsamer fallen

    ctx.fillRect(block.x, block.y, blockSize, blockSize);

    // Kollision prüfen
    if (
      block.y + blockSize > player.y &&
      block.x < player.x + player.width &&
      block.x + blockSize > player.x
    ) {
      gameOver = true;
    }

    // Block weg, wenn unten
    if (block.y > canvas.height) {
      blocks.splice(i, 1);
      score++;
    }
  }

  // Score anzeigen
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 20);

  if (!gameOver) {
    requestAnimationFrame(draw);
  } else {
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Game Over! Endscore: " + score, 50, canvas.height / 2 - 20);
    ctx.fillText("Drücke R zum Neustart", 50, canvas.height / 2 + 20);
  }
}

// Spieler bewegen
document.addEventListener("keydown", e => {
  if (!gameOver) {
    if (e.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
    if (e.key === "ArrowRight" && player.x + player.width < canvas.width) player.x += player.speed;
  }

  // Neustart nach Game Over
  if (gameOver && e.key.toLowerCase() === "r") {
    restartGame();
  }
});

// Spiel neu starten
function restartGame() {
  blocks.length = 0;
  score = 0;
  gameOver = false;
  draw();
}

// Blöcke alle 1 Sekunde erzeugen
setInterval(createBlock, 1000);

// Spiel starten
draw();
function showGameOverPopup() {
  const popup = document.getElementById("gameOverPopup");
  const scoreText = document.getElementById("finalScore");
  scoreText.textContent = "Dein Score: " + score;
  popup.style.display = "flex";
}

// Neustart-Button
document.getElementById("restartBtn").addEventListener("click", () => {
  const popup = document.getElementById("gameOverPopup");
  popup.style.display = "none";
  restartGame();
});

// In der Kollision statt alert():
if (
  block.y + blockSize > player.y &&
  block.x < player.x + player.width &&
  block.x + blockSize > player.x
) {
  gameOver = true;
  showGameOverPopup(); // Zeigt Popup
}const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Button Steuerung für Touch
document.getElementById("leftBtn").addEventListener("touchstart", () => {
  if (!gameOver && player.x > 0) player.x -= player.speed;
});
document.getElementById("rightBtn").addEventListener("touchstart", () => {
  if (!gameOver && player.x + player.width < canvas.width) player.x += player.speed;
});


// Canvas an Fenstergröße anpassen
function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth - 20, 400);
  canvas.height = Math.min(window.innerHeight - 150, 400);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
