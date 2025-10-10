<?php
$conn = new mysqli("localhost", "dein_benutzername", "dein_passwort", "inf_431_25j_playgrid");
$result = $conn->query("
  SELECT u.username, s.game_name, s.score, s.played_at
  FROM scores s
  JOIN users u ON s.user_id = u.id
  ORDER BY s.score DESC
");

echo "<h2>🏆 Bestenliste</h2>";
echo "<table border='1'><tr><th>Spieler</th><th>Spiel</th><th>Score</th><th>Datum</th></tr>";
while ($row = $result->fetch_assoc()) {
  echo "<tr><td>{$row['username']}</td><td>{$row['game_name']}</td><td>{$row['score']}</td><td>{$row['played_at']}</td></tr>";
}
echo "</table>";
$conn->close();
?>
