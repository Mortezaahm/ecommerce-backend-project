const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const errorBox = document.getElementById("login-error");
  if (errorBox) errorBox.textContent = "";

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Inloggningen misslyckades.");
    }

    const token = data.data?.token;
    const user = data.data?.user;

    if (!token || !user?.id) {
      throw new Error("Ogiltigt svar från servern.");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("userId", user.id);
    localStorage.setItem("name", user.name || "");
    localStorage.setItem("role", user.role || "");

    alert("Inloggning lyckades!");

    if (user.role === "admin") {
      window.location.href = "../pages/admin.html";
    } else {
      window.location.href = "../pages/member.html";
    }
  } catch (error) {
    console.error(error);

    if (errorBox) {
      errorBox.textContent = error.message;
    } else {
      alert(error.message);
    }
  }
});
