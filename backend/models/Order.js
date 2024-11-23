const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
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
  inProgress: {
    type: Boolean,
    default: false,
  },
  productionStatus: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
