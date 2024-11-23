const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const { isAuthenticated } = require("../middleware/auth");

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

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const {
      transaction,
      from,
      to,
      productName,
      quantity,
      quotedPrice,
      estimatedDeliveryDate,
      extraInfo,
      deadline,
      inProgress,
      productionStatus,
      delivered,
      paymentStatus,
    } = req.body;

    const order = new Order({
      transaction,
      from,
      to,
      productName,
      quantity,
      quotedPrice,
      estimatedDeliveryDate,
      extraInfo,
      deadline,
      inProgress,
      productionStatus,
      delivered,
      paymentStatus,
    });

    await order.save();

    // Append the order to the user's orders array
    await User.findByIdAndUpdate(from, { $push: { orders: order._id } });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order" });
  }
});

router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    /*
      Update types:
      - order accepted
      - order out for delivery
      - order delivered
      - payment initiated
      - payment completed
      - payment received by seller
    */
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.from.toString() !== req.user._id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Order.findByIdAndUpdate(id);
  } catch (error) {
    res.status(500).json({ message: "Error updating order" });
  }
});

module.exports = router;
