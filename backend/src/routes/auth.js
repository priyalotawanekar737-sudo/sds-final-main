const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
require("dotenv").config();

/* ================== REGISTER ================== */
router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    email,
    password,
    state,
    city,
    pincode,
    dob,
    role,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: `${firstName} ${lastName}`,
      phone,
      email,
      password: hashedPassword,
      state,
      city,
      pincode,
      dob,
      role,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "12h" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


/* ================== LOGIN ================== */
/* ================== LOGIN ================== */
router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  try {
    // Normalize email
    email = email.trim().toLowerCase();

    console.log("🔎 Login attempt:", email);

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("👤 User found:", user);

    if (!user) {
      console.log("❌ No user found with this email");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Password incorrect");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "12h" }
    );

    console.log("✅ Login successful");

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});



/* ================== GET CURRENT USER ================== */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (err) {
    console.error("Me route error:", err);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

module.exports = router;
