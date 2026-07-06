const express = require("express");
const {
  createApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/careerController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public: customer/job applicant submits application
router.post("/", createApplication);

// Admin: view, update, delete applications
router.get("/", protect, adminOnly, getApplications);
router.put("/:id", protect, adminOnly, updateApplicationStatus);
router.delete("/:id", protect, adminOnly, deleteApplication);

module.exports = router;