const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    bakeryName: {
      type: String,
      default: "Tous Les Jours",
      trim: true,
    },

    businessPhone: {
      type: String,
      default: "",
      trim: true,
    },

    openingHours: {
      type: String,
      default: "07:00",
    },

    closingHours: {
      type: String,
      default: "20:00",
    },

    deliveryFee: {
      type: Number,
      default: 0,
    },

    enableDelivery: {
      type: Boolean,
      default: true,
    },

    deliveryStartTime: {
      type: String,
      default: "09:00",
    },

    deliveryEndTime: {
      type: String,
      default: "20:00",
    },

    deliveryDuration: {
      type: Number,
      default: 40,
    },

    cookTime: {
      type: Number,
      default: 20,
    },

    facebook: {
      type: String,
      default: "",
      trim: true,
    },

    instagram: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);