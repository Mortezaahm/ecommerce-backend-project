// assets/js/admin-orders.js
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    alert("Access denied! You must be an admin.");
    window.location.href = "/pages/login.html";
    return;
  }

  const tableBody = document.querySelector("#orders-table tbody");

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      tableBody.innerHTML = "";

      data.forEach((order) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${order.order_id}</td>
          <td>${order.user_name || order.user_id}</td>
          <td>${Number(order.total_price).toFixed(2)} kr</td>
          <td>${order.status || "Pending"}</td>
          <td>${new Date(order.created_at).toLocaleString()}</td>
          <td>
            <button class="btn btn-sm btn-info view-btn" data-id="${order.order_id}">
              <i class="bi bi-eye"></i> View
            </button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${order.order_id}">
              <i class="bi bi-trash"></i> Delete
            </button>
          </td>
        `;
        tableBody.appendChild(tr);
      });

      attachEvents();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  function attachEvents() {
    // View order
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.closest("button").dataset.id;
        alert(`View order ${id} - here you can open a modal to details page`);
      });
    });

    // Delete order
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.closest("button").dataset.id;
        if (!confirm(`Are you sure you want to delete order ${id}?`)) return;

        try {
          const res = await fetch(`/api/orders/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await res.json();
          if (res.status >= 400)
            throw new Error(data.message || "Failed to delete");

          alert("Order deleted successfully");
          fetchOrders();
        } catch (err) {
          alert(err.message);
        }
      });
    });
  }

  // Initial load
  fetchOrders();
});
