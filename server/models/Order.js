const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    name: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    orderType: {
      type: String,
      enum: ["delivery", "pickup"],
      required: true,
      default: "delivery",
    },

    address: {
      type: String,
      default: "",
    },

    pickupTime: {
      type: String,
      default: "",
    },

    items: [orderItemSchema],

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "online",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "paid",
    },

    transactionId: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "new",
        "preparing",
        "readyForPickup",
        "outForDelivery",
        "completed",
        "cancelled",
      ],
      default: "new",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `TLJ-${Date.now().toString().slice(-6)}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);