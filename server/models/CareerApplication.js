const mongoose = require("mongoose");

const careerApplicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "reviewed", "contacted", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerApplication", careerApplicationSchema);