(async function loadProfile() {
  try {
    const res = await fetch('/check-auth', { credentials: 'include' });
    if (!res.ok) return (window.location.href = '/login');
    const data = await res.json();
    document.getElementById('userName').textContent = data.user.name;
  } catch (err) {
    console.log("Auth failed", err);
    window.location.href = "/login";
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cartContainer");

  async function loadCart() {
    try {
      const res = await fetch("/api/cart", { credentials: "include" });
      const cart = await res.json();

      if (!cart || !cart.items.length) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
      }

      cartContainer.innerHTML = "";
      cart.items.forEach(({ product, quantity }) => {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
          <img src="${product.image}" alt="${product.title}" />
          <div class="cart-item-info">
            <h4>${product.title}</h4>
            <p>₹${product.price} x ${quantity}</p>
          </div>
          <div class="cart-item-actions">
            <input type="number" min="1" value="${quantity}" data-id="${product._id}" />
            <button class="update" data-id="${product._id}">Update</button>
            <button class="remove" data-id="${product._id}">Remove</button>
          </div>
        `;
        cartContainer.appendChild(div);
      });

      attachCartHandlers();
    } catch (err) {
      console.error("Cart load error:", err);
    }
  }

  function attachCartHandlers() {
    const updateBtns = document.querySelectorAll(".update");
    const removeBtns = document.querySelectorAll(".remove");

    updateBtns.forEach(btn => {
      btn.addEventListener("click", async () => {
        const productId = btn.dataset.id;
        const input = btn.previousElementSibling;
        const quantity = parseInt(input.value);

        if (quantity < 1) return alert("Invalid quantity");

        const res = await fetch("/api/cart", {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity })
        });

        const data = await res.json();
        if (res.ok) {
          alert("Cart updated");
          loadCart();
        } else {
          alert(data.message || "Update failed");
        }
      });
    });

    removeBtns.forEach(btn => {
      btn.addEventListener("click", async () => {
        const productId = btn.dataset.id;
        const res = await fetch(`/api/cart/${productId}`, {
          method: "DELETE",
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
          alert("Item removed");
          loadCart();
        } else {
          alert(data.message || "Failed to remove");
        }
      });
    });
  }

  loadCart();
});
