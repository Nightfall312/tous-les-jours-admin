const express = require("express");
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, adminOnly, getOrders).post(createOrder);

router
  .route("/:id")
  .get(protect, adminOnly, getOrderById)
  .put(protect, adminOnly, updateOrderStatus)
  .delete(protect, adminOnly, deleteOrder);

module.exports = router;