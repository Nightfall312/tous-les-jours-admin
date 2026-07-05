const Order = require("../models/Order");

const getReportSummary = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  const completedOrders = orders.filter((order) => order.status === "completed");
  const cancelledOrders = orders.filter((order) => order.status === "cancelled");
  const deliveryOrders = orders.filter((order) => order.orderType === "delivery");
  const pickupOrders = orders.filter((order) => order.orderType === "pickup");

  const totalRevenue = completedOrders.reduce(
    (sum, order) => sum + Number(order.totalPrice || 0),
    0
  );

  const cancelledValue = cancelledOrders.reduce(
    (sum, order) => sum + Number(order.totalPrice || 0),
    0
  );

  const productMap = {};

  completedOrders.forEach((order) => {
    order.items?.forEach((item) => {
      if (!productMap[item.name]) {
        productMap[item.name] = {
          name: item.name,
          units: 0,
          revenue: 0,
        };
      }

      productMap[item.name].units += Number(item.qty || 0);
      productMap[item.name].revenue +=
        Number(item.qty || 0) * Number(item.price || 0);
    });
  });

  const topProducts = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  res.json({
    totalOrders: orders.length,
    completedOrders: completedOrders.length,
    cancelledOrders: cancelledOrders.length,
    deliveryOrders: deliveryOrders.length,
    pickupOrders: pickupOrders.length,
    totalRevenue,
    cancelledValue,
    topProducts,
    orders,
  });
};

const deleteReportOrders = async (req, res) => {
  const { status } = req.body;

  if (!["completed", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Буруу төлөв байна" });
  }

  const result = await Order.deleteMany({ status });

  res.json({
    message: "Захиалгууд устгагдлаа",
    deletedCount: result.deletedCount,
  });
};

module.exports = {
  getReportSummary,
  deleteReportOrders,
};