// assets/js/pages/admin-products.js
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    alert("Access denied!");
    window.location.href = "/pages/login.html";
    return;
  }

  const tableBody = document.querySelector("#products-table tbody");
  const form = document.getElementById("add-product-form");

  // function to fetch the list of products
  async function fetchProducts() {
    try {
      const res = await fetch("http://localhost:3000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!data.success) {
        alert("Failed to fetch products");
        return;
      }

      tableBody.innerHTML = "";

      data.products.forEach((product) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
                    <td>${product.product_id}</td>
                    <td><input type="text" value="${product.title}" class="edit-title" data-id="${product.product_id}"></td>
                    <td><input type="number" value="${product.price}" class="edit-price" data-id="${product.product_id}"></td>
                    <td>
                        <select class="edit-stock" data-id="${product.product_id}">
                            <option value="true" ${product.in_stock ? "selected" : ""}>In Stock</option>
                            <option value="false" ${!product.in_stock ? "selected" : ""}>Out of Stock</option>
                        </select>
                    </td>
                    <td><input type="text" value="${product.category.title}" class="edit-category" data-id="${product.product_id}"></td>
                    <td>
                        <button class="update-btn" data-id="${product.product_id}">Update</button>
                        <button class="delete-btn" data-id="${product.product_id}">Delete</button>
                    </td>
                `;
        tableBody.appendChild(tr);
      });

      attachEvents();
    } catch (err) {
      console.error(err);
    }
  }

  // function to attach event listeners to update and delete buttons
  function attachEvents() {
    // Update product
    document.querySelectorAll(".update-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const title = document.querySelector(
          `.edit-title[data-id="${id}"]`,
        ).value;
        const price = parseFloat(
          document.querySelector(`.edit-price[data-id="${id}"]`).value,
        );
        const in_stock =
          document.querySelector(`.edit-stock[data-id="${id}"]`).value ===
          "true";
        const category = document.querySelector(
          `.edit-category[data-id="${id}"]`,
        ).value;

        try {
          const res = await fetch(`http://localhost:3000/api/products/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, price, in_stock, category }),
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message);
          alert("Product updated successfully");
          fetchProducts();
        } catch (err) {
          alert(err.message);
        }
      });
    });

    // Delete product
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
          const res = await fetch(`http://localhost:3000/api/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.message);
          alert("Product deleted successfully");
          fetchProducts();
        } catch (err) {
          alert(err.message);
        }
      });
    });
  }

  // Add new product
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const price = parseFloat(document.getElementById("price").value);
    const in_stock = document.getElementById("in_stock").value === "true";
    const category = document.getElementById("category").value;

    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, price, in_stock, category }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      alert("Product added successfully");
      form.reset();
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  });

  // first load products
  fetchProducts();
});
