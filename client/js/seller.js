document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const productContainer = document.getElementById("productContainer");
  const ordersContainer = document.getElementById("ordersContainer");

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const res = await fetch("/api/products", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      alert("Product uploaded successfully");
      form.reset();
      loadProducts();
    } else {
      alert(data.message || "Upload failed");
    }
  });

  // ✅ Get current user ID from server (since token is httpOnly)
  async function getCurrentUserId() {
    try {
      const res = await fetch("/api/users/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("User not authenticated");

      const data = await res.json();
      return data.id;
    } catch (err) {
      console.warn("User fetch failed:", err);
      return null;
    }
  }

  // Load all products and filter by current seller
  async function loadProducts() {
    const currentUserId = await getCurrentUserId();
    console.log("✅ Current user ID from server:", currentUserId);
    if (!currentUserId) return;

    const res = await fetch("/api/products", { credentials: "include" });
    const products = await res.json();
    productContainer.innerHTML = "";

    products.forEach((product) => {
      const sellerId = product.seller?._id || product.seller;
      const isOwner = String(sellerId) === String(currentUserId);

      if (isOwner) {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
          <img src="${product.image}" alt="Product" />
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <p>Price: ₹${product.price}</p>
          <p>Category: ${product.category}</p>
          <button class="edit" onclick="editProduct('${product._id}')">Edit</button>
          <button onclick="deleteProduct('${product._id}')">Delete</button>
        `;
        productContainer.appendChild(div);
      }
    });
  }

  // Load seller orders (if any)
  async function loadOrders() {
    const res = await fetch("/api/orders/seller-orders", {
      credentials: "include",
    });
    const orders = await res.json();
    ordersContainer.innerHTML = "";

    orders.forEach((order) => {
      const div = document.createElement("div");
      div.className = "order-card";
      div.innerHTML = `
        <h4>Order ID: ${order._id}</h4>
        <p>Status: ${order.status}</p>
        <p>Items:</p>
        <ul>
          ${order.items
            .map(
              (item) =>
                `<li>${item.product?.title || "Deleted Product"} x${item.quantity}</li>`
            )
            .join("")}
        </ul>
      `;
      ordersContainer.appendChild(div);
    });
  }

  // Edit product
  window.editProduct = async (id) => {
  try {
    const res = await fetch(`/api/products/${id}`, {
      credentials: "include",
    });
    const product = await res.json();

    const newTitle = prompt("New title:", product.title);
    const newDescription = prompt("New description:", product.description);
    const newPrice = prompt("New price:", product.price);
    const newCategory = prompt("New category:", product.category);
    const newQuantity = prompt("New quantity:", product.quantity);

    if (!newTitle || !newDescription || !newPrice || !newCategory || !newQuantity) {
      alert("All fields are required to update.");
      return;
    }

    const updatedProduct = {
      title: newTitle,
      description: newDescription,
      price: Number(newPrice),
      category: newCategory,
      quantity: Number(newQuantity),
    };

    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
      credentials: "include",
    });

    alert("Product updated successfully.");
    loadProducts();
  } catch (err) {
    console.error("Error updating product:", err);
    alert("Failed to update product.");
  }
};


  // Delete product
  window.deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    await fetch(`/api/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    loadProducts();
  };

  // Initial load
  loadProducts();
  loadOrders();
});
