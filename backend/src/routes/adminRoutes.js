const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Donation = require("../models/Donation");

/* ================= ADMIN STATS ================= */
router.get("/stats", auth, async (req, res) => {
  // Allow access for admin and volunteer roles (read-only counts)
  if (req.user.role !== "admin" && req.user.role !== "volunteer")
    return res.status(403).json({ msg: "Forbidden" });

  try {
    // Count only donors that are approved
    const totalDonors = await User.countDocuments({ role: "donor" });
    const totalNGOs = await User.countDocuments({ role: "ngo" });
    const totalVolunteers = await User.countDocuments({ role: "volunteer" });
    const totalDonations = await Donation.countDocuments();

    res.json({
      totalDonors,
      totalNGOs,
      totalVolunteers,
      totalDonations,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* ================= DONATIONS ================= */
router.get("/donations", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Forbidden" });

  const donations = await Donation.find()
    .populate("donor", "name")
    .sort({ createdAt: -1 });

  res.json(donations);
});

router.get("/volunteers", auth, async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" });

    const data = await Promise.all(
      volunteers.map(async (volunteer) => {

        const assignedCount = await Donation.countDocuments({
          volunteerId: volunteer._id, // must match schema field
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
