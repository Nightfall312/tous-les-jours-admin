const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, default: "" },
    location: { type: String, default: "Дархан" },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "intern", "temporary"],
      default: "full-time",
    },
    salary: { type: String, default: "" },
    description: { type: String, required: true },
    requirements: { type: String, default: "" },
    benefits: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);