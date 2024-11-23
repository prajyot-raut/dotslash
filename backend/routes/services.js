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

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { name, description } = req.body;
    const service = new Service({
      name,
      description,
      createdBy: req.user._id,
    });

    await service.save();

    // Append the service to the user's services array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { services: service._id },
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Error creating service" });
  }
});

module.exports = router;
