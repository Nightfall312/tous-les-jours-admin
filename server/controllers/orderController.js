const Order = require("../models/Order");

const getOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Захиалга олдсонгүй" });
  }

  res.json(order);
};

const createOrder = async (req, res) => {
  const {
    customerName,
    phone,
    orderType,
    address,
    pickupTime,
    items,
    totalPrice,
    paymentStatus,
    transactionId,
    notes,
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Захиалгын бүтээгдэхүүн хоосон байна" });
  }

  if (orderType === "delivery" && !address) {
    return res.status(400).json({ message: "Хүргэлтийн хаяг шаардлагатай" });
  }

  const order = await Order.create({
    customerName,
    phone,
    orderType,
    address: orderType === "delivery" ? address : "",
    pickupTime: orderType === "pickup" ? pickupTime : "",
    items,
    totalPrice,
    paymentStatus: paymentStatus || "paid",
    transactionId,
    notes,
  });

  res.status(201).json(order);
};

const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Захиалга олдсонгүй" });
  }

  order.status = req.body.status ?? order.status;
  order.paymentStatus = req.body.paymentStatus ?? order.paymentStatus;

  const updatedOrder = await order.save();
  res.json(updatedOrder);
};

const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Захиалга олдсонгүй" });
  }

  await order.deleteOne();
  res.json({ message: "Захиалга устгагдлаа" });
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};