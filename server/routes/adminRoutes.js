const router = require("express").Router();
const isLoggenIn = require("../middlewares/isLoggedIn");
const {adminOnly} = require("../middlewares/auth");
const {getSellers, getSellerStats} = require("../controllers/adminController");

console.log("login: ", isLoggenIn);
console.log("admin: ", adminOnly);
console.log("getseller: ", getSellers);
console.log("sellerStats: ", getSellerStats);

router.get("/sellers", isLoggenIn, adminOnly, getSellers);
router.get("/seller-stats", isLoggenIn, adminOnly, getSellerStats);

module.exports = router;
