const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
let isPlaying = true;

musicToggle.addEventListener("click", () => {
  if (isPlaying) {
    music.pause();
    musicToggle.textContent = "🔇";
  } else {
    music.play();
    musicToggle.textContent = "🔊";
  }
  isPlaying = !isPlaying;
});

document.getElementById("startGame").addEventListener("click", () => {
  alert("🎮 Spiel wird gestartet...");
  // später -> window.location.href = "game.html";
});
