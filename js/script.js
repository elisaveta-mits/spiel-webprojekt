const users = [
  { username: "elisaveta", password: "1234" },
  { username: "test", password: "abcd" }
];

function login() {
  const name = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  const user = users.find(u => u.username === name && u.password === pass);

  if (user) {
    window.location.href = "home.html"; // Login erfolgreich
  } else {
    alert("Benutzername oder Passwort ist falsch!");
  }
}
