const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("email", email);
    console.log("hashedPassword", hashedPassword);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ msg: "Registered successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Request body:", req.body);

    const user = await User.findOne({ email });
    if (!user) return res.json({ msg: "Invalid credentials" });
    console.log("User:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ msg: "Login successful", token });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
