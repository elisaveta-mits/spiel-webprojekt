const cells = document.querySelectorAll(".cell");
const startBtn = document.getElementById("startBtn");
const infoText = document.getElementById("infoText");
const result = document.getElementById("result");

let activeCell = null;
let startTime;
let score = 0;
let rounds = 0;
let gameRunning = false;

startBtn.addEventListener("click", startGame);

cells.forEach(cell => {
  cell.addEventListener("click", handleClick);
  cell.addEventListener("touchstart", handleClick);
});

function startGame() {
  score = 0;
  rounds = 0;
  result.textContent = "";
  infoText.textContent = "Achtung... gleich geht’s los!";
  gameRunning = true;
  startBtn.disabled = true;

  setTimeout(nextRound, 1000 + Math.random() * 1500);
}

function nextRound() {
  if (!gameRunning) return;

  if (rounds >= 5) {
    endGame();
    return;
  }

  rounds++;
  infoText.textContent = `Runde ${rounds} – bereit?`;

  const randomDelay = 1000 + Math.random() * 2000;
  setTimeout(() => {
    if (!gameRunning) return;

    const randomIndex = Math.floor(Math.random() * cells.length);
    activeCell = cells[randomIndex];
    activeCell.classList.add("active");
    startTime = new Date().getTime();
  }, randomDelay);
}

function handleClick(e) {
  if (!activeCell || !gameRunning) return;

  const reactionTime = new Date().getTime() - startTime;
  activeCell.classList.remove("active");
  activeCell = null;

  score += Math.max(0, 1000 - reactionTime);
  infoText.textContent = `Reaktionszeit: ${reactionTime} ms`;
  setTimeout(nextRound, 800);
}

function endGame() {
  gameRunning = false;
  startBtn.disabled = false;
  const avg = Math.round(score / 5);
  result.textContent = `🏁 Spiel vorbei! Deine Punktzahl: ${avg}`;
  infoText.textContent = "Drücke auf 'Spiel starten' um neu zu beginnen.";
}
