document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "" || password === "") {
    document.getElementById("errorMsg").textContent = "Bitte alle Felder ausfüllen.";
    return;
  }

  // 👉 Später hier echte Datenbankprüfung
  if (username === "test" && password === "98uz6t") {
    window.location.href = "home.html";
  } else {
    document.getElementById("errorMsg").textContent = "Falscher Benutzername oder Passwort.";
  }
});
