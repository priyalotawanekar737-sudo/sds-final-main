const express = require("express");
const router = express.Router();
const Ngo = require("../models/ngo");
const auth = require("../middleware/auth");
const ngoController = require("../controllers/ngoController");


// ✅ Get all NGOs
router.get("/", async (req, res) => {
  try {
    const ngos = await Ngo.find().sort({ createdAt: -1 });
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch NGOs" });
  }
});

// ✅ Add NGO
router.post("/", async (req, res) => {
  const { name, email, city } = req.body;

  if (!name || !email || !city) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const existing = await Ngo.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "NGO already exists" });
    }

    const ngo = new Ngo({ name, email, city });
    await ngo.save();

    res.status(201).json({ message: "NGO added", ngo });
  } catch (err) {
    res.status(500).json({ message: "Failed to add NGO" });
  }
});

// ✅ Delete NGO
router.delete("/:id", async (req, res) => {
  try {
    await Ngo.findByIdAndDelete(req.params.id);
    res.json({ message: "NGO deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete NGO" });
  }
});

module.exports = router;
