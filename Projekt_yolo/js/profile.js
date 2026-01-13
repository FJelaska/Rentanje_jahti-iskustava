document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("/api/me");
  if (!res.ok) return;

  const data = await res.json();
  if (!data.ok || !data.user) return;

  const u = data.user;

  const nameEl = document.getElementById("Name");
  if (nameEl) nameEl.textContent = `${u.first_name} ${u.last_name}`;

  const dobEl = document.getElementById("Datum");
  if (dobEl && u.birth_date) dobEl.textContent = new Date(u.birth_date).toLocaleDateString();

  const genderEl = document.getElementById("Spol");
  if (genderEl && u.gender) genderEl.textContent = u.gender;

  const mailEl = document.getElementById("mail");
  if (mailEl && u.email) mailEl.textContent = u.email;
});
