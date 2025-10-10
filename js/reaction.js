const gameArea = document.getElementById("gameArea");
const infoText = document.getElementById("infoText");
const result = document.getElementById("result");
const startBtn = document.getElementById("startBtn");

let activePlanet = null;
let startTime;
let score = 0;
let rounds = 0;
let gameRunning = false;
let maxRounds = 10;

startBtn.addEventListener("click", startGame);

function startGame() {
  score = 0;
  rounds = 0;
  result.textContent = "";
  infoText.textContent = "Bereit... es geht gleich los!";
  gameRunning = true;
  startBtn.disabled = true;

  setTimeout(nextRound, 1500);
}

function nextRound() {
  if (!gameRunning) return;

  if (rounds >= maxRounds) {
    endGame();
    return;
  }

  rounds++;
  infoText.textContent = `Runde ${rounds}/${maxRounds}`;
  //zufällig von 1 bis 3 sek.
  const delay = 1000 + Math.random() * 2000;
  setTimeout(() => {
    if (!gameRunning) return;

    createPlanet();
    startTime = new Date().getTime();
  }, delay);
}

function createPlanet() {
  if (activePlanet) activePlanet.remove();

  activePlanet = document.createElement("div");
  activePlanet.classList.add("planet");

  const areaRect = gameArea.getBoundingClientRect();
  const x = Math.random() * (gameArea.clientWidth - 70);
  const y = Math.random() * (gameArea.clientHeight - 70);

  activePlanet.style.left = `${x}px`;
  activePlanet.style.top = `${y}px`;

  gameArea.appendChild(activePlanet);

  // Desktop + Touch
  activePlanet.addEventListener("click", handleClick);
  activePlanet.addEventListener("touchstart", handleClick);
}

function handleClick() {
  if (!activePlanet || !gameRunning) return;

  const reactionTime = new Date().getTime() - startTime;
  score += Math.max(0, 1000 - reactionTime);
  infoText.textContent = `Reaktionszeit: ${reactionTime} ms`;

  activePlanet.remove();
  activePlanet = null;

  setTimeout(nextRound, 800);
}

function endGame() {
  gameRunning = false;
  startBtn.disabled = false;

  const avg = Math.round(score / maxRounds);
  result.textContent = `🏁 Fertig! Dein Reaktionsdurchschnitt: ${avg} Punkte`;
  infoText.textContent = "Drücke 'Spiel starten' für eine neue Runde.";
}


function saveScore(score) {
  fetch('save_score.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `game_name=Reaction&score=${score}`
  })
  .then(response => response.text())
  .then(data => console.log(data));
}
