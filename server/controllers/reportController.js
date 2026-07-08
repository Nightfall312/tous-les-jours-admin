const Order = require("../models/Order");
const ExcelJS = require("exceljs");

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
const exportReportsPdf = async (req, res) => {
  res.status(501).json({
    message: "PDF export хараахан хийгдээгүй байна",
  });
};

const exportReportsExcel = async (req, res) => {
  const orders = await Order.find({
    status: { $in: ["completed", "cancelled"] },
  }).sort({ createdAt: -1 });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reports");

  worksheet.columns = [
    { header: "Захиалгын ID", key: "_id", width: 30 },
    { header: "Хэрэглэгч", key: "customerName", width: 20 },
    { header: "Утас", key: "phone", width: 15 },
    { header: "Төлөв", key: "status", width: 15 },
    { header: "Нийт дүн", key: "totalPrice", width: 15 },
    { header: "Огноо", key: "createdAt", width: 25 },
  ];

  orders.forEach((order) => {
    worksheet.addRow({
      _id: order._id.toString(),
      customerName: order.customerName || "",
      phone: order.phone || "",
      status: order.status || "",
      totalPrice: order.totalPrice || 0,
      createdAt: order.createdAt
        ? new Date(order.createdAt).toLocaleString("mn-MN")
        : "",
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=reports.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
};

module.exports = {
  getReportSummary,
  deleteReportOrders,
  exportReportsExcel,
  exportReportsPdf,
};