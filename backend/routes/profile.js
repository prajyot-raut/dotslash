const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User"); // Import the User model
const { isAuthenticated } = require("../middleware/auth");

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
      paymentStatus,
    });

    await order.save();

    // Append the order to the user's orders array
    await User.findByIdAndUpdate(from, { $push: { orders: order._id } });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
});

module.exports = router;
