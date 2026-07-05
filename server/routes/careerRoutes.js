const express = require("express");
const {
  createApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/careerController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(createApplication).get(protect, adminOnly, getApplications);

router
  .route("/:id")
  .put(protect, adminOnly, updateApplicationStatus)
  .delete(protect, adminOnly, deleteApplication);

module.exports = router;