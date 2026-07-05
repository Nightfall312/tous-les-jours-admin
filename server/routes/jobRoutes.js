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

router.get("/public", getActiveJobs);

router
  .route("/")
  .get(protect, adminOnly, getJobs)
  .post(protect, adminOnly, createJob);

router
  .route("/:id")
  .put(protect, adminOnly, updateJob)
  .delete(protect, adminOnly, deleteJob);

module.exports = router;