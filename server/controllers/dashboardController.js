const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
  const products = await Product.find();
  const categories = await Category.find();
  const orders = await Order.find().sort({ createdAt: -1 });

  const completedOrders = orders.filter((order) => order.status === "completed");
  const newOrders = orders.filter((order) => order.status === "new");

  const totalRevenue = completedOrders.reduce(
    (sum, order) => sum + Number(order.totalPrice || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5
  );

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock || 0) <= 0
  );

  res.json({
    totalProducts: products.length,
    totalCategories: categories.length,
    totalOrders: orders.length,
    newOrders: newOrders.length,
    completedOrders: completedOrders.length,
    totalRevenue,
    lowStockProducts: lowStockProducts.length,
    outOfStockProducts: outOfStockProducts.length,
    recentOrders: orders.slice(0, 5),
  });
};

module.exports = {
  getDashboardStats,
};