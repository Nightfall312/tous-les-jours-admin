const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
  const [
    totalProducts,
    totalCategories,
    totalOrders,
    newOrders,
    completedOrders,
    lowStockProducts,
    outOfStockProducts,
    recentOrders,
    revenueResult,
  ] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: "new" }),
    Order.countDocuments({ status: "completed" }),
    Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }),
    Product.countDocuments({ stock: { $lte: 0 } }),
    Order.find().sort({ createdAt: -1 }).limit(5),
    Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]),
  ]);

  res.json({
    totalProducts,
    totalCategories,
    totalOrders,
    newOrders,
    completedOrders,
    lowStockProducts,
    outOfStockProducts,
    totalRevenue: revenueResult[0]?.totalRevenue || 0,
    recentOrders,
  });
};

module.exports = { getDashboardStats };