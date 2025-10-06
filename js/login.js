function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Benutzerliste
  const users = [
    { username: "test", password: "98uz6t" },       // Dein neuer User
    { username: "elisaveta", password: "1234" }    // Optional, bleibt falls du mehrere brauchst
  ];

  // Überprüfung
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    console.log("Login erfolgreich!");
    window.location.href = "home.html"; // Weiterleitung zur Homepage
  } else {
    alert("Benutzername oder Passwort ist falsch. Bitte erneut versuchen.");
  }
}