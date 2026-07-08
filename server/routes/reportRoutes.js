const express = require("express");

const {
  getReportSummary,
  deleteReportOrders,
  exportReportsPdf,
  exportReportsExcel,
} = require("../controllers/reportController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getReportSummary);
router.delete("/orders", protect, adminOnly, deleteReportOrders);
router.get("/export/pdf", protect, adminOnly, exportReportsPdf);
router.get("/export/excel", protect, adminOnly, exportReportsExcel);

module.exports = router;