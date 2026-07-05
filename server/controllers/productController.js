const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const fs = require("fs");
const path = require("path");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const createProduct = asyncHandler(async (req, res) => {
  const imagePaths = req.files
    ? req.files.map((file) => `/uploads/products/${file.filename}`)
    : [];

  const product = await Product.create({
    name: req.body.name,
    category: req.body.category,
    productType: req.body.productType,
    description: req.body.description,
    price: Number(req.body.price),
    stock: Number(req.body.stock),
    isFeatured: req.body.isFeatured === "true",
    isAvailable: req.body.isAvailable === "true",
    images: imagePaths,
  });

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const imagePaths = req.files
    ? req.files.map((file) => `/uploads/products/${file.filename}`)
    : [];

  // Update fields
  product.name = req.body.name ?? product.name;

  product.price =
    req.body.price !== undefined
      ? Number(req.body.price)
      : product.price;

  product.stock =
    req.body.stock !== undefined
      ? Number(req.body.stock)
      : product.stock;

  product.description =
    req.body.description ?? product.description;

  product.category =
    req.body.category ?? product.category;

  product.productType =
    req.body.productType ?? product.productType;

  if (req.body.isAvailable !== undefined) {
    product.isAvailable =
      req.body.isAvailable === true ||
      req.body.isAvailable === "true";
  }

  if (req.body.isFeatured !== undefined) {
    product.isFeatured = req.body.isFeatured === true || req.body.isFeatured === "true";
  }

  if (req.files && req.files.length > 0) {
    if (product.images && product.images.length > 0) {
      product.images.forEach((imagePath) => {
        const fullPath = path.join(__dirname, "..", imagePath);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    product.images = req.files.map(
      (file) => `/uploads/products/${file.filename}`
    );
  }

  // Save
  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.images && product.images.length > 0) {
    product.images.forEach((imagePath) => {
      const fullPath = path.join(__dirname, "..", imagePath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });
  }

  await product.deleteOne();

  res.json({ message: "Product deleted" });
});

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};