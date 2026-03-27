// assets/js/pages/admin-categories.js
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // admin check
  if (!token || role !== "admin") {
    alert("Access denied! You must be an admin.");
    window.location.href = "/pages/login.html";
    return;
  }

  const tableBody = document.querySelector("#categories-table tbody");
  const form = document.getElementById("add-category-form");

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      tableBody.innerHTML = "";

      data.forEach((cat) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${cat.category_id}</td>
          <td>
            <input class="form-control edit-title" data-id="${cat.category_id}" value="${cat.title}">
          </td>
          <td>
            <button class="btn btn-sm btn-success update-btn" data-id="${cat.category_id}">Update</button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${cat.category_id}">Delete</button>
          </td>
        `;

        tableBody.appendChild(tr);
      });

      attachEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to fetch categories.");
    }
  }

  // Attach Events
  function attachEvents() {
    // Update category
    document.querySelectorAll(".update-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const title = document.querySelector(
          `.edit-title[data-id="${id}"]`,
        ).value;

        try {
          const res = await fetch(`/api/categories/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title }),
          });

          const data = await res.json();
          if (res.status >= 400)
            throw new Error(data.message || "Failed to update");

          alert("Category updated successfully");
          fetchCategories();
        } catch (err) {
          alert(err.message);
        }
      });
    });

    // Delete category
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
          const res = await fetch(`/api/categories/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await res.json();
          if (res.status >= 400)
            throw new Error(data.message || "Failed to delete");

          alert("Category deleted successfully");
          fetchCategories();
        } catch (err) {
          alert(err.message);
        }
      });
    });
  }

  // =========================
  // Add New Category
  // =========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();
      if (res.status >= 400)
        throw new Error(data.message || "Failed to create category");

      alert("Category added successfully");
      form.reset();
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  });

  // Initial load
  fetchCategories();
});
