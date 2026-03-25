// assets/js/pages/admin.js
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    alert("Access denied!");
    window.location.href = "/pages/login.html";
    return;
  }

  const tableBody = document.querySelector("#users-table tbody");

  // fetch users and populate table
  async function fetchUsers() {
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!data.success) {
        alert("Failed to fetch users");
        return;
      }

      tableBody.innerHTML = ""; // delete old rows

      data.users.forEach((user) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <select data-id="${user.id}" class="role-select">
                            <option value="user" ${user.role === "user" ? "selected" : ""}>User</option>
                            <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
                        </select>
                    </td>
                    <td>
                        <button data-id="${user.id}" class="delete-btn">Delete</button>
                    </td>
                `;
        tableBody.appendChild(tr);
      });

      attachEvents(); // add event listeners after rendering
    } catch (err) {
      console.error(err);
    }
  }

  // attach event listeners to select and delete buttons
  function attachEvents() {
    // change role
    document.querySelectorAll(".role-select").forEach((select) => {
      select.addEventListener("change", async (e) => {
        const userId = e.target.dataset.id;
        const newRole = e.target.value;

        try {
          const res = await fetch(`/api/users/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ role: newRole }),
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message);
          alert("Role updated successfully");
        } catch (err) {
          alert(err.message);
        }
      });
    });

    // remove user
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const userId = e.target.dataset.id;

        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
          const res = await fetch(`/api/users/${userId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message);
          alert("User deleted successfully");
          fetchUsers(); // refresh the list
        } catch (err) {
          alert(err.message);
        }
      });
    });
  }

  // load initial data
  fetchUsers();
});
