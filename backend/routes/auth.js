const express = require("express");
const passport = require("passport"); // Added require statement
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    console.log("Creating user");
    console.log(email, password, name);

    const user = new User({ email, password, name });
    await user.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  const token = req.user.generateAuthToken(); // Assuming you have a method to generate a token
  res.json({ message: "Login successful", token });
});

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logout successful" });
  });
});

module.exports = router;
