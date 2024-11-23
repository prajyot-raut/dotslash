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
    enum: ["pending", "initiated", "completed", "received_by_seller"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
