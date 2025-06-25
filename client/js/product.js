(async function checkAuth() {
  try {
    const res = await fetch('/check-auth', { method: 'GET', credentials: 'include' });
    if (!res.ok) return window.location.href = '/login';
    const data = await res.json();
    console.log("User is logged in: ", data.user);
  } catch (error) {
    console.log("Auth check failed", error);
    window.location.href = '/login';
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.querySelector(".product-preview");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const filterPanel = document.getElementById("filterPanel");
  const filterLink = document.getElementById("filterLink");

  // Toggle panel when navbar filter link clicked
  filterLink.addEventListener("click", (e) => {
    e.preventDefault();
    filterPanel.classList.toggle("open");
  });

  let allProducts = [];
  let cartProductIds = [];

  async function loadProducts() {
    try {
      const res = await fetch("/api/products");
      allProducts = await res.json();
      await fetchCart();
      displayProducts(allProducts);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  }

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart", { credentials: "include" });
      const cartData = await res.json();
      cartProductIds = cartData.items.map(item => item.product._id);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  }

  function displayProducts(products) {
    productContainer.innerHTML = "";
    if (products.length === 0) {
      productContainer.innerHTML = "<p>No products found.</p>";
      return;
    }

    products.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      const isInCart = cartProductIds.includes(product._id);
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" />
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p class="price">₹${product.price}</p>
        <p class="category">Category: ${product.category}</p>
        ${
          isInCart
            ? `<span class="in-cart-label">✅ Already in Cart</span>`
            : `<button class="add-cart" data-id="${product._id}">Add to Cart</button>`
        }
      `;

      productContainer.appendChild(card);
    });

    const buttons = document.querySelectorAll(".add-cart");
    buttons.forEach(btn => btn.addEventListener("click", () => addToCart(btn.dataset.id)));
  }

  searchBtn.addEventListener("click", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = allProducts.filter(p =>
      p.title.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword) ||
      p.category.toLowerCase().includes(keyword)
    );
    displayProducts(filtered);
  });

document.getElementById("applyFiltersBtn").addEventListener("click", () => {
  const filterPanel = document.getElementById("filterPanel");
  filterPanel.classList.remove("open"); // ✅ Close the filter panel

  const filterBags = document.getElementById("filterBags").checked;
  const filterTShirts = document.getElementById("filterT-Shirts").checked;
  const filterGlasses = document.getElementById("filterGlasses").checked;
  const filterShoes = document.getElementById("filterShoes").checked;
  const filterWatches = document.getElementById("filterWatches").checked;
  const filterHeadPhones = document.getElementById("filterHeadPhones").checked;
  const filterHoodies = document.getElementById("filterHoodies").checked;
  const filterJackets = document.getElementById("filterJackets").checked;
  const filterAccessories = document.getElementById("filterAccessories").checked;
  const filterPants = document.getElementById("filterPants").checked;
  const filterUnder500 = document.getElementById("filterUnder500").checked;

  const filtered = allProducts.filter(p => {
    const category = p.category.toLowerCase();

    const matchCategory =
      (!filterBags &&
        !filterTShirts &&
        !filterGlasses &&
        !filterShoes &&
        !filterWatches &&
        !filterHeadPhones &&
        !filterHoodies &&
        !filterJackets &&
        !filterAccessories &&
        !filterPants) ||
      (filterBags && category === "bags") ||
      (filterTShirts && category === "t-shirts") ||
      (filterGlasses && category === "glasses") ||
      (filterShoes && category === "shoes") ||
      (filterWatches && category === "watches") ||
      (filterHeadPhones && category === "headphones") ||
      (filterHoodies && category === "hoodies") ||
      (filterJackets && category === "jackets") ||
      (filterAccessories && category === "accessories") ||
      (filterPants && category === "pants");

    const matchPrice = !filterUnder500 || p.price <= 500;

    return matchCategory && matchPrice;
  });

  displayProducts(filtered);
});


  async function addToCart(productId) {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Product added to cart!");
        await fetchCart();
        displayProducts(allProducts);
      } else {
        alert(data.message || "Failed to add to cart.");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Error adding to cart. Please login.");
    }
  }

  loadProducts();
});
