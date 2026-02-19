const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const Donation = require("../models/Donation");
const User = require("../models/User");
const mongoose = require("mongoose");
require("dotenv").config();

/* ================= AUTH MIDDLEWARE ================= */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret123"
    );
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/* ================= ROUTES ================= */

// ✅ GET ALL DONATIONS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "name email state city")
      .populate("acceptedBy", "name email")
      .populate("volunteerId", "name email");

    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching donations" });
  }
});

// ✅ CREATE DONATION (Donor)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, state, city, pincode } = req.body;

    if (!title || !description || !state || !city || !pincode)
      return res.status(400).json({ message: "All fields required" });

    const donor = await User.findById(req.user.id);
    if (!donor || donor.role !== "donor")
      return res.status(403).json({ message: "Only donors allowed" });

    const donation = await Donation.create({
      donor: new mongoose.Types.ObjectId(req.user.id),
      title,
      description,
      state,
      city,
      pincode,
      status: "pending",
    });

    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: "Error creating donation" });
  }
});

// ✅ ACCEPT DONATION (NGO)
router.put("/:id/accept", authMiddleware, async (req, res) => {
  try {
    const ngo = await User.findById(req.user.id);
    if (!ngo || ngo.role !== "ngo")
      return res.status(403).json({ message: "Only NGOs allowed" });

    const donation = await Donation.findById(req.params.id);
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });

    donation.status = "accepted";
    donation.acceptedBy = new mongoose.Types.ObjectId(req.user.id);

    await donation.save();
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: "Error accepting donation" });
  }
});

// ✅ ASSIGN VOLUNTEER (NGO)
router.put("/:id/assign", authMiddleware, async (req, res) => {
  try {
    const { volunteerId } = req.body;

    const ngo = await User.findById(req.user.id);
    if (!ngo || ngo.role !== "ngo")
      return res.status(403).json({ message: "Only NGOs allowed" });

    const donation = await Donation.findById(req.params.id);
    if (!donation || donation.status !== "accepted")
      return res.status(400).json({ message: "Accept donation first" });

    donation.volunteerId = new mongoose.Types.ObjectId(volunteerId);
    donation.status = "assigned";

    await donation.save();
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: "Error assigning volunteer" });
  }
});

// ✅ COMPLETE DONATION + IMAGE UPLOAD
router.put(
  "/:id/complete",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const donation = await Donation.findById(req.params.id);
      if (!donation)
        return res.status(404).json({ message: "Donation not found" });

      donation.status = "delivered";
      donation.proofImage = `/uploads/${req.file.filename}`;

      await donation.save();
      res.json(donation);
    } catch (err) {
      res.status(500).json({ message: "Error completing donation" });
    }
  }
);

module.exports = router;
