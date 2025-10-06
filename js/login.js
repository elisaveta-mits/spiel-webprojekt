function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const users = [
    { username: "elisaveta", password: "1234" },
    { username: "test", password: "abcd" }
  ];

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    console.log("Login erfolgreich!");
    window.location.href = "home.html";  // Weiter zur Menüseite
  } else {
    alert("Benutzername oder Passwort ist falsch. Bitte erneut versuchen.");
  }
}
