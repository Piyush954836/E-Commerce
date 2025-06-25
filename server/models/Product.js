const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  category: {
    type: String,
    enum: [
      "T-Shirts",
      "Bags",
      "Glasses",
      "Shoes",
      "Watches",
      "Headphones",
      "Hoodies",
      "Jackets",
      "Accessories",
      "Pants"
    ],
    required: true
  },
  quantity: Number,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
module.exports = mongoose.model("Product", productSchema);
