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
  
router.get("/volunteers", auth, async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" });

    const data = await Promise.all(
      volunteers.map(async (volunteer) => {

        // Count only active assignments
        const assignedCount = await Donation.countDocuments({
          volunteer: volunteer._id,
          status: { 
            $in: ["assigned", "on_the_way", "collected"] 
          }
        });

        return {
          _id: volunteer._id,
          name: volunteer.name,
          email: volunteer.email,
          assignedCount
        };
      })
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching volunteers" });
  }
});



module.exports = router;
