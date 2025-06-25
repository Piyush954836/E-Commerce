const User = require("../models/User");
const Product = require('../models/Product');

exports.getSellers = async (req, res) => {
  const sellers = await User.find({ role: 'seller' });
  res.json(sellers);
};

exports.getSellerStats = async (req, res) => {
  const products = await Product.find().populate("seller");
  const stats = {};
  products.forEach(p => {
    const name = p.seller.name;
    if (!stats[name]) stats[name] = { count: 0, products: [] };
    stats[name].count++;
    stats[name].products.push(p);
  });
  res.json(stats);
};