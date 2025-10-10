// js/puzzle.js — pointer-basierte, responsive Drag&Drop-Variante
const puzzleBoard = document.getElementById("puzzleBoard");
const piecesArea = document.getElementById("piecesArea");
const message = document.getElementById("message");
const levelText = document.getElementById("levelText");

let currentLevel = 1;
const totalLevels = 3;
const imagePaths = ["img/level1.jpg","img/level2.jpg","img/level3.jpg"];

// Hilfswerte
function getBoardSize() {
  // max 450px, sonst 90vw
  return Math.min(window.innerWidth * 0.9, 450);
}

// Start
loadLevel(currentLevel);

// Lädt ein Level (3x3, 4x4, 5x5)
function loadLevel(level) {
  message.textContent = "";
  levelText.textContent = `Level ${level}`;

  puzzleBoard.innerHTML = "";
  piecesArea.innerHTML = "";

  const gridSizes = {1:3, 2:4, 3:5};
  const gridSize = gridSizes[level] || 3;
  const boardSize = getBoardSize();
  const pieceSize = Math.floor(boardSize / gridSize);

  // Board dimensionen setzen (responsiv)
  puzzleBoard.style.width = `${boardSize}px`;
  puzzleBoard.style.height = `${boardSize}px`;
  puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize}, ${pieceSize}px)`;
  puzzleBoard.style.gridTemplateRows = `repeat(${gridSize}, ${pieceSize}px)`;

  // Dropzonen erstellen (jede Zelle), richtige Position des Teils
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.style.width = `${pieceSize}px`;
    cell.style.height = `${pieceSize}px`;


    // DragOver/Drop sind nicht nötig für Pointer-API, aber so kann man auch native DnD benutzen
    cell.addEventListener("dragover", e => e.preventDefault());
    cell.addEventListener("drop", e => e.preventDefault());
    puzzleBoard.appendChild(cell);
  }

  // Teile erzeugen in zufälliger Reihenfolge
  const total = gridSize * gridSize;
  const correctIndices = Array.from({length: total}, (_, i)=>i);
  // shuffled order for piecesArea
  const shuffled = [...correctIndices].sort(()=>Math.random()-0.5);

  const img = imagePaths[level-1];

  shuffled.forEach((correctIndex) => {
    const row = Math.floor(correctIndex / gridSize);
    const col = correctIndex % gridSize;

    const piece = document.createElement("div");
    piece.className = "piece";
    piece.draggable = false; // wir verwenden Pointer API
    piece.dataset.correctIndex = correctIndex;

    // Größe & Hintergrund (passt exakt zusammen)
    piece.style.width = `${pieceSize}px`;
    piece.style.height = `${pieceSize}px`;
    piece.style.backgroundImage = `url(${img})`;
    // backgroundSize in Prozent so, dass das gesamte Bild auf das Board passt
    piece.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
    // backgroundPosition so setzen, dass Teil genau zur Zelle passt
    piece.style.backgroundPosition = `${(col/(gridSize-1))*100}% ${(row/(gridSize-1))*100}%`;

    // pointer events für Touch+Mouse
    piece.style.touchAction = "none";

    // Pointer-Event-Handler (universell für Touch & Maus)
    piece.addEventListener("pointerdown", pointerDown);

    piecesArea.appendChild(piece);
  });

  // Stücke Area optisch anpassen (damit nicht in eine Spalte geraten)
  // (CSS sollte flex-wrap haben; hier optional max-width setzen)
  piecesArea.style.maxWidth = `${Math.min(320, boardSize*0.6)}px`;
}

// --- Pointer Drag & Drop (funktioniert auf Desktop & Mobile) ---
let draggingEl = null;
let offsetX = 0;
let offsetY = 0;
let originalParent = null;
let originalNextSibling = null;

function pointerDown(e) {
  // Nur mit Hauptfinger / primary button
  if (!e.isPrimary) return;
  e.preventDefault();

  draggingEl = e.currentTarget;
  draggingEl.setPointerCapture(e.pointerId);

  // Merken, von wo das Teil kommt
  originalParent = draggingEl.parentElement;
  originalNextSibling = draggingEl.nextElementSibling;

  // berechne Offsets, damit Cursor an gleicher Stelle bleibt
  const rect = draggingEl.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  // style verändern, damit Element über allem schwebt
  draggingEl.style.position = "fixed";
  draggingEl.style.left = `${rect.left}px`;
  draggingEl.style.top = `${rect.top}px`;
  draggingEl.style.zIndex = 9999;
  draggingEl.style.pointerEvents = "none"; // verhindert, dass elementFromPoint das Element selbst erkennt

  // events
  window.addEventListener("pointermove", pointerMove);
  window.addEventListener("pointerup", pointerUp);
}

function pointerMove(e) {
  if (!draggingEl) return;
  e.preventDefault();
  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;
  draggingEl.style.left = `${x}px`;
  draggingEl.style.top = `${y}px`;
}

function pointerUp(e) {
  if (!draggingEl) return;
  draggingEl.releasePointerCapture?.(e.pointerId);

  // ermitteln, wo losgelassen wurde
  const dropTarget = document.elementFromPoint(e.clientX, e.clientY);

  // Wenn auf eine Zelle losgelassen wurde:
  const cell = dropTarget && dropTarget.closest && dropTarget.closest(".cell");
  if (cell) {
    // Wenn Zelle leer → hineinlegen
    if (!cell.firstElementChild) {
      cell.appendChild(draggingEl);
      resetDraggedStyle(draggingEl);
    } else {
      // Zelle belegt → swap: existierendes Element tauschen mit draggingEl
      const existing = cell.firstElementChild;
      // Hänge draggingEl in die Zelle
      cell.appendChild(draggingEl);
      // lege das existente wieder an den Ort, von dem draggingEl kam
      if (originalParent && originalParent.classList.contains("cell")) {
        // origin war eine Zelle → lege existing dorthin
        originalParent.appendChild(existing);
      } else {
        // origin war piecesArea -> return existing zu piecesArea
        piecesArea.appendChild(existing);
      }
      resetDraggedStyle(draggingEl);
    }
    checkWin();
  } else {
    // Wenn auf piecesArea oder außerhalb: zurücklegen in piecesArea
    const area = dropTarget && dropTarget.closest && dropTarget.closest("#piecesArea");
    if (area) {
      piecesArea.appendChild(draggingEl);
      resetDraggedStyle(draggingEl);
    } else {
      // sonst: wenn origin Zelle war, bleibt es nicht verloren - lege zurück an Ursprung
      if (originalParent && originalParent.classList.contains("cell") && !originalParent.firstElementChild) {
        originalParent.appendChild(draggingEl);
      } else {
        piecesArea.appendChild(draggingEl);
      }
      resetDraggedStyle(draggingEl);
    }
  }

  // Aufräumen
  window.removeEventListener("pointermove", pointerMove);
  window.removeEventListener("pointerup", pointerUp);
  draggingEl = null;
  originalParent = null;
  originalNextSibling = null;
}

function resetDraggedStyle(el) {
  el.style.position = "";
  el.style.left = "";
  el.style.top = "";
  el.style.zIndex = "";
  el.style.pointerEvents = "";
}

// --- Prüft, ob Puzzle komplett richtig ist ---
function checkWin() {
  const cells = puzzleBoard.querySelectorAll(".cell");
  let matched = 0;
  cells.forEach(cell => {
    const piece = cell.querySelector(".piece");
    if (piece && piece.dataset.correctIndex == cell.dataset.index) matched++;
  });
  if (matched === cells.length) {
    message.textContent = "🎉 Geschafft!";
    setTimeout(() => {
      if (currentLevel < totalLevels) {
        currentLevel++;
        loadLevel(currentLevel);
      } else {
        message.textContent = "🏆 Alle Levels geschafft!";
      }
    }, 900);
  }
}

// Rebuild bei Fenstergröße ändern (damit alles responsiv bleibt)
window.addEventListener("resize", () => {
  // kleine Debounce
  clearTimeout(window._puzzleResizeTime);
  window._puzzleResizeTime = setTimeout(() => loadLevel(currentLevel), 250);
});


function saveScore(score) {
  fetch('save_score.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `game_name=Puzzle&score=${score}`
  })
  .then(response => response.text())
  .then(data => console.log(data));
}
