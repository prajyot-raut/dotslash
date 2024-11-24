const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const User = require("../models/User");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const services = await Service.find({}).sort({
      createdAt: -1,
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services" });
  }
});

router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Error fetching service" });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User:", req.user);

    if (!req.body.name || !req.body.description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const service = new Service({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      createdBy: req.user._id,
    });

    const savedService = await service.save();
    console.log("Saved service:", savedService);

    // Update user's services array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { services: savedService._id } },
      { new: true }
    );

    res.status(201).json(savedService);
  } catch (error) {
    console.error("Service creation error:", error);
    res.status(500).json({
      message: "Error creating service",
      error: error.message,
    });
  }
});

module.exports = router;
