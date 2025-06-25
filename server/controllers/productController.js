const Product = require("../models/Product");
const cloudinary = require('../utils/cloudinary');

exports.createProduct = async (req, res) => {
  const { title, description, price, category, quantity } = req.body;

  try {
    let imageUrl = null;

    if (req.file) {
      // Upload image from memory buffer
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            resource_type: 'image'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer); // send buffer to stream
      });

      imageUrl = uploadResult.secure_url;
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      quantity,
      image: imageUrl,
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({ error: "Product creation failed" });
  }
};


exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product || product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "_id name");
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("Get Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
