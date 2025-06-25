const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadImage");
const isLoggedIn = require("../middlewares/isLoggedIn");
const {sellerOnly} = require("../middlewares/auth");
const {createProduct, updateProduct, deleteProduct, getAllProducts, getProductById} = require("../controllers/productController");

router.post("/", isLoggedIn, sellerOnly, upload.single("image"), createProduct);
router.put("/:id", isLoggedIn, sellerOnly, updateProduct);
router.delete("/:id", isLoggedIn, sellerOnly, deleteProduct);
router.get("/", getAllProducts);
router.get('/:id', getProductById);

module.exports = router;