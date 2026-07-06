const express = require("express");
const {
  getJobs,
  getActiveJobs,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public: website can show active job offers
router.get("/active", getActiveJobs);

// Admin: manage all job offers
router.get("/", protect, adminOnly, getJobs);
router.post("/", protect, adminOnly, createJob);
router.put("/:id", protect, adminOnly, updateJob);
router.delete("/:id", protect, adminOnly, deleteJob);

module.exports = router;