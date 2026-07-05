const express = require("express");
const {
  getReportSummary,
  deleteReportOrders,
} = require("../controllers/reportController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getReportSummary);
router.delete("/orders", protect, adminOnly, deleteReportOrders);

module.exports = router;