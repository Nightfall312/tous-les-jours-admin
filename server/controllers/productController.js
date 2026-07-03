const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isAvailable: true })
    .populate("category", "name")
    .sort("-createdAt");

  res.json(products);
});

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

  product.name = req.body.name;
  product.category = req.body.category;
  product.productType = req.body.productType;
  product.description = req.body.description;
  product.price = Number(req.body.price);
  product.stock = Number(req.body.stock);
  product.isFeatured = req.body.isFeatured === "true";
  product.isAvailable = req.body.isAvailable === "true";

  if (imagePaths.length > 0) {
    product.images = imagePaths;
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};