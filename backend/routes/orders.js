const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const Service = require("../models/Service");
const { isAuthenticated } = require("../middleware/auth");
const mongoose = require("mongoose");

// Add timer check middleware
const checkDisputeDeadline = async (order) => {
  if (order.disputeDeadline && new Date() > new Date(order.disputeDeadline)) {
    await Order.findByIdAndUpdate(order._id, {
      $push: {
        notifications: {
          message: "Dispute period has expired for this order",
        },
      },
    });
  }
};

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({ from: req.user._id }).sort({
      createdAt: -1,
    });

    // Check deadlines for all orders
    await Promise.all(orders.map(checkDisputeDeadline));

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
  const { updateType, paymentDetails } = req.body;
  const validUpdateTypes = [
    "order_accepted",
    "order_out_for_delivery",
    "order_delivered",
    "payment_initiated",
    "payment_completed",
    "payment_received_by_seller",
    "dispute_initiated",
    "dispute_resolved",
    "refund_initiated",
    "refund_completed",
    "payment_done",
    "payment_verified",
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
        order.paymentDetails = paymentDetails;
        break;
      case "payment_completed":
        order.paymentStatus = "completed";
        order.paymentVerifiedAt = new Date();
        break;
      case "payment_received_by_seller":
        order.paymentStatus = "received_by_seller";
        break;
      case "dispute_initiated":
        order.disputeStatus = "initiated";
        order.disputeDetails = req.body.details;
        break;
      case "dispute_resolved":
        order.disputeStatus = "resolved";
        break;
      case "refund_initiated":
        order.paymentStatus = "refund_pending";
        break;
      case "refund_completed":
        order.paymentStatus = "refunded";
        break;
      case "payment_done":
        order.paymentStatus = "payment_done";
        break;
      case "payment_verified":
        order.paymentStatus = "payment_verified";
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

router.get("/:id", isAuthenticated, async (req, res) => {
  // ...existing code...
});

// Add endpoint to get notifications
router.get("/notifications", isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ from: req.user._id }, { to: req.user._id }],
      "notifications.read": false,
    });

    const notifications = orders.flatMap((order) =>
      order.notifications.filter((n) => !n.read)
    );

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

module.exports = router;
