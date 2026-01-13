document.getElementById("username").focus();
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value.trim();
  let errorMsg = document.getElementById("errorMsg");

  if (username === "" || password === "") {
      errorMsg.textContent = "Please fill in all fields.";
      return;
  }

  let savedPassword = localStorage.getItem(username);

  if (savedPassword === null) {
      errorMsg.textContent = "User does not exist.";
      return;
  }

  if (savedPassword !== password) {
      errorMsg.textContent = "Incorrect password.";
      return;
  }

  localStorage.setItem("loggedInUser", username);
  alert("Login successful");
});
