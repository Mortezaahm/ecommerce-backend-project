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

    // support both response formats
    const user = data.data?.user;
    const userId = user?.id || data.data?.userId;
    const name = user?.name || "";
    const role = user?.role || "user";

    if (!token || !userId) {
      throw new Error("Ogiltigt svar från servern.");
    }

    // Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("name", name || ""); // Save name if available
    localStorage.setItem("role", role || "");

    // Redirect based on role
    if (role === "admin") {
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
