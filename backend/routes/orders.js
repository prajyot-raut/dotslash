const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const Service = require("../models/Service");
const { isAuthenticated } = require("../middleware/auth");
const mongoose = require("mongoose");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({ from: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

router.post("/:serviceID", isAuthenticated, async (req, res) => {
  try {
    const { serviceID } = req.params;
    const from = req.user._id;
    const {
      transaction,
      productName,
      quantity,
      quotedPrice,
      estimatedDeliveryDate,
      extraInfo,
      deadline,
      orderStatus,
    } = req.body;

    console.log("Request body:", req.body);

    const service = await Service.findById(serviceID);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    console.log("Service:", service);

    const order = new Order({
      from,
      to: service.createdBy,
      productName,
      quantity,
      quotedPrice,
      estimatedDeliveryDate,
      extraInfo,
      deadline,
      orderStatus,
      serviceRef: serviceID,
    });
    console.log("Order:", order);

    await order.save();

    // Append the order to the user's orders array
    await User.findByIdAndUpdate(String(from), {
      $push: { orders: order._id },
    });

    console.log("Order saved successfully");

    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Error creating order" });
  }
});

router.put("/:id", isAuthenticated, async (req, res) => {
  const { updateType } = req.body;
  const validUpdateTypes = [
    "order_accepted",
    "order_out_for_delivery",
    "order_delivered",
    "payment_initiated",
    "payment_completed",
    "payment_received_by_seller",
  ];

  if (!validUpdateTypes.includes(updateType)) {
    return res.status(400).json({ message: "Invalid update type" });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    switch (updateType) {
      case "order_accepted":
        order.orderStatus = "accepted";
        break;
      case "order_out_for_delivery":
        order.orderStatus = "out_for_delivery";
        break;
      case "order_delivered":
        order.orderStatus = "delivered";
        break;
      case "payment_initiated":
        order.paymentStatus = "initiated";
        break;
      case "payment_completed":
        order.paymentStatus = "completed";
        break;
      case "payment_received_by_seller":
        order.paymentStatus = "received_by_seller";
        break;
      default:
        return res.status(400).json({ message: "Invalid update type" });
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order" });
  }
});

router.get("/received", isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({ to: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching received orders" });
  }
});

module.exports = router;
