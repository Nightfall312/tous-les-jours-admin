const express = require("express");
const {
  getSettings,
  updateSettings,
} = require("../controllers/settingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin settings
router.get("/", protect, adminOnly, getSettings);
router.put("/", protect, adminOnly, updateSettings);

module.exports = router;