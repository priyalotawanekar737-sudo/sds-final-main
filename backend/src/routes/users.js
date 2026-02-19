const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// GET volunteers (NGO only)
router.get("/volunteers", auth, async (req, res) => {
  try {
    if (req.user.role !== "ngo") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const volunteers = await User.find({ role: "volunteer" }).select("-password");
    res.json(volunteers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
