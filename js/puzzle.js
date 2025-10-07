const images = ["img/level1.jpg", "img/level2.jpg", "img/level3.jpg"];
let level = 1;
let gridSize = 3;
const board = document.getElementById("puzzleBoard");
const piecesArea = document.getElementById("piecesArea");
const message = document.getElementById("message");
const levelText = document.getElementById("levelText");

function loadLevel(lvl) {
  message.textContent = "";
  levelText.textContent = `Level ${lvl}`;
  board.innerHTML = "";
  piecesArea.innerHTML = "";

  gridSize = lvl + 2; // 3x3, 4x4, 5x5
  board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  board.style.width = board.style.height = "min(80vw, 400px)";

  const totalPieces = gridSize * gridSize;
  const indices = Array.from({ length: totalPieces }, (_, i) => i);
  const shuffled = [...indices].sort(() => Math.random() - 0.5);

  const imgSrc = images[lvl - 1];
  const pieceSize = 400 / gridSize;

  // Dropzonen erzeugen
  indices.forEach((i) => {
    const dropzone = document.createElement("div");
    dropzone.classList.add("dropzone");
    dropzone.dataset.index = i;
    dropzone.style.width = `${pieceSize}px`;
    dropzone.style.height = `${pieceSize}px`;
    dropzone.addEventListener("dragover", (e) => e.preventDefault());
    dropzone.addEventListener("drop", onDrop);
    board.appendChild(dropzone);
  });

  // Puzzleteile zufällig anordnen
  shuffled.forEach((i) => {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.draggable = true;
    piece.dataset.index = i;
    piece.style.width = `${pieceSize}px`;
    piece.style.height = `${pieceSize}px`;
    piece.style.backgroundImage = `url(${imgSrc})`;
    piece.style.backgroundSize = `${400}px ${400}px`;
    piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;
    piece.addEventListener("dragstart", onDragStart);
    piece.addEventListener("touchstart", onTouchStart);
    piecesArea.appendChild(piece);
  });

  // Shuffle die Reihenfolge (CSS zufällige Positionen)
  const pieces = [...piecesArea.children];
  pieces.forEach((piece) => {
    piece.style.order = Math.floor(Math.random() * totalPieces);
  });
}

let draggedPiece = null;

function onDragStart(e) {
  draggedPiece = e.target;
}

function onDrop(e) {
  if (!draggedPiece) return;
  const target = e.currentTarget;

  // Wenn Dropzone leer → hinlegen
  if (target.childElementCount === 0) {
    target.appendChild(draggedPiece);
  }
  // Wenn man ein Teil zurückziehen möchte → zurück in den Teilebereich
  else if (target.classList.contains("dropzone") && draggedPiece.parentElement !== piecesArea) {
    piecesArea.appendChild(draggedPiece);
  }

  checkWin();
}

// Touch-Unterstützung (Handy)
function onTouchStart(e) {
  const touch = e.touches[0];
  draggedPiece = e.target;

  const move = (moveEvent) => {
    const el = document.elementFromPoint(moveEvent.touches[0].clientX, moveEvent.touches[0].clientY);
    if (el && el.classList.contains("dropzone") && el.childElementCount === 0) {
      el.appendChild(draggedPiece);
      document.removeEventListener("touchmove", move);
      checkWin();
    }
  };

  document.addEventListener("touchmove", move);
}

function checkWin() {
  const zones = [...document.querySelectorAll(".dropzone")];
  const correct = zones.every((zone) => {
    const piece = zone.firstElementChild;
    return piece && piece.dataset.index === zone.dataset.index;
  });
  if (correct) {
    message.textContent = "🎉 Geschafft!";
    setTimeout(() => {
      if (level < images.length) {
        level++;
        loadLevel(level);
      } else {
        message.textContent = "🏆 Alle Levels geschafft!";
      }
    }, 1500);
  }
}

loadLevel(level);
