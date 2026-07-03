const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isAvailable: true })
    .populate("category", "name")
    .sort("-createdAt");

  res.json(products);
});

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    productType,
    description,
    price,
    images,
    stock,
    isFeatured,
  } = req.body;

  const product = await Product.create({
    name,
    category,
    productType,
    description,
    price,
    images,
    stock,
    isFeatured,
  });

  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.assign(product, req.body);

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.isAvailable = false;
  await product.save();

  res.json({ message: "Product disabled" });
});

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};