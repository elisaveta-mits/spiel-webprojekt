<?php
// Datenbank-Verbindung
$servername = "localhost"; // später anpassen!
$username = "db_003704";
$password = "4Rp6rNkuXDVm";
$dbname = "inf_431_25j_playgrid";

// Verbindung herstellen
$conn = new mysqli($servername, $username, $password, $dbname);

// Prüfen, ob die Verbindung funktioniert
if ($conn->connect_error) {
  die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

// Login prüfen
$user = $_POST['username'];
$pass = $_POST['password'];

$sql = "SELECT * FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
  if (hash('sha256', $pass) === $row['password_hash']) {
    echo "success";
  } else {
    echo "wrong";
  }
} else {
  echo "wrong";
}

$conn->close();
?>
