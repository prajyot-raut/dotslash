const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  quotedPrice: {
    type: Number,
    required: true,
  },
  estimatedDeliveryDate: {
    type: Date,
    required: true,
  },
  extraInfo: {
    type: String,
  },
  deadline: {
    type: Date,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["pending", "accepted", "out_for_delivery", "delivered"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: [
      "pending",
      "initiated",
      "completed",
      "payment_done",
      "payment_verified",
    ],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
  },
  disputeDeadline: {
    type: Date,
  },
  timers: {
    deliveryTimer: {
      type: Number,
      default: 45, // 45 days for delivery dispute
    },
    paymentTimer: {
      type: Number,
      default: 7, // 7 days for payment completion
    },
  },
  notifications: [
    {
      message: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      read: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

orderSchema.pre("save", function (next) {
  if (this.orderStatus === "delivered" && !this.disputeDeadline) {
    this.deliveryDate = new Date();
    this.disputeDeadline = new Date(
      Date.now() + this.timers.deliveryTimer * 24 * 60 * 60 * 1000
    );
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
