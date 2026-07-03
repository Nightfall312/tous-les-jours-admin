const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort("name");
  res.json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const category = await Category.create({
    name,
    description,
  });

  res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  category.name = req.body.name || category.name;
  category.description = req.body.description ?? category.description;
  category.isActive = req.body.isActive ?? category.isActive;

  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  category.isActive = false;
  await category.save();

  res.json({ message: "Category disabled" });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};