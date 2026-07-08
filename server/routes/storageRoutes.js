const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getStorageStats } = require("../controllers/storageController");

router.get("/", protect, adminOnly, getStorageStats);

module.exports = router;