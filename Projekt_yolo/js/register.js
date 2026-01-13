document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let errorMsg = document.getElementById("errorMsg");

  const longPassword = password.length >= 15;
  const complexPassword = password.length >= 8 && /[a-z]/.test(password) && /[0-9]/.test(password);

  if(!longPassword && !complexPassword){
    errorMsg.textContent = "Incomplete password.";
    return;
  }

  if (localStorage.getItem(email)) {
      errorMsg.textContent = "Account already exists.";
      return;
  }

  let user = {
      firstName: firstName.value,
      lastName: lastName.value,
      birthDate: birthDate.value,
      gender: gender.value,
      country: country.value,
      password: password
  };

  localStorage.setItem(email, JSON.stringify(user));
  alert("Account created successfully");

  window.location.href = "login_index.html";
});
