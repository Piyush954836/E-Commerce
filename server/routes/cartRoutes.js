const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");

router.post("/", isLoggedIn, addToCart);              // Add to cart
router.get("/", isLoggedIn, getCart);                 // Get user's cart
router.put("/", isLoggedIn, updateCartItem);          // Update quantity
router.delete("/:productId", isLoggedIn, removeFromCart); // Remove item

module.exports = router;
