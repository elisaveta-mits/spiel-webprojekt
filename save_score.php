<?php
session_start();

// Verbindung zur Datenbank
$conn = new mysqli("localhost", "dein_benutzername", "dein_passwort", "inf_431_25j_playgrid");

if ($conn->connect_error) {
  die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

$user_id = $_SESSION['user_id'];  // Angemeldeter Benutzer
$game_name = $_POST['game_name'];
$score = $_POST['score'];

// Score speichern
$stmt = $conn->prepare("INSERT INTO scores (user_id, game_name, score) VALUES (?, ?, ?)");
$stmt->bind_param("isi", $user_id, $game_name, $score);
$stmt->execute();

echo "✅ Score gespeichert!";
$stmt->close();
$conn->close();
?>
