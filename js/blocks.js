const gameArea = document.getElementById("gameArea");
const statusText = document.getElementById("statusText");
const player = document.getElementById("player");

let playerX = 0;
let enemies = [];
let score = 0;
let speed = 3;
let gameOver = false;
let enemyInterval = null;

// --- 🧭 Bewegung mit Pfeiltasten (Desktop)
document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  const step = 25;
  if (e.key === "ArrowLeft" && playerX > 0) playerX -= step;
  if (e.key === "ArrowRight" && playerX < gameArea.offsetWidth - player.offsetWidth)
    playerX += step;
  player.style.left = playerX + "px";
});

// --- 🧤 Touch-Steuerung für Mobilgeräte
let touchStartX = null;
let touchEndX = null;

gameArea.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});

gameArea.addEventListener("touchmove", (e) => {
  if (gameOver) return;
  touchEndX = e.touches[0].clientX;
  const diff = touchEndX - touchStartX;

  // Wenn der Finger deutlich nach rechts oder links bewegt wurde
  if (Math.abs(diff) > 30) {
    const step = 30;
    if (diff > 0 && playerX < gameArea.offsetWidth - player.offsetWidth) playerX += step;
    if (diff < 0 && playerX > 0) playerX -= step;

    player.style.left = playerX + "px";
    touchStartX = touchEndX; // Reset, damit man flüssig weiterschieben kann
  }
});

// --- 🧱 Gegner erzeugen
function createEnemy() {
  if (gameOver) return;
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = Math.random() * (gameArea.offsetWidth - 40) + "px";
  enemy.style.top = "0px";
  gameArea.appendChild(enemy);
  enemies.push(enemy);
}

// --- ⚙️ Spiel-Schleife
function gameLoop() {
  if (gameOver) return;

  enemies.forEach((enemy, index) => {
    let y = parseFloat(enemy.style.top);
    y += speed;
    enemy.style.top = y + "px";

    if (isColliding(player, enemy)) {
      gameOver = true;
      statusText.innerHTML = `💥 <b>Game Over!</b> Punkte: ${score}`;
      clearInterval(enemyInterval);
    }

    if (y > gameArea.offsetHeight) {
      enemy.remove();
      enemies.splice(index, 1);
      score++;
      statusText.textContent = `Punkte: ${score}`;
      if (score % 10 === 0 && speed < 10) speed += 0.5;
    }
  });

  requestAnimationFrame(gameLoop);
}

function isColliding(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(
    aRect.top > bRect.bottom ||
    aRect.bottom < bRect.top ||
    aRect.left > bRect.right ||
    aRect.right < bRect.left
  );
}

function restartGame() {
  enemies.forEach(e => e.remove());
  enemies = [];
  score = 0;
  speed = 3;
  gameOver = false;
  if (enemyInterval) clearInterval(enemyInterval);
  playerX = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
  player.style.left = playerX + "px";
  statusText.textContent = "Weiche den fallenden Blöcken aus!";
  startGame();
}

function startGame() {
  if (enemyInterval) clearInterval(enemyInterval);
  enemyInterval = setInterval(createEnemy, 1000);
  requestAnimationFrame(gameLoop);
}

playerX = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
player.style.left = playerX + "px";
startGame();
