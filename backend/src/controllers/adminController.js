const User = require("../models/User");
const Donation = require("../models/Donation");
const Ngo = require("../models/ngo");

/* ================= DASHBOARD STATS ================= */
exports.getDashboardStats = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const [totalDonors, totalVolunteers, totalNGOs, totalDonations] =
      await Promise.all([
        User.countDocuments({ role: "donor" }),
        User.countDocuments({ role: "volunteer" }),
        Ngo.countDocuments({ status: "approved" }),
        Donation.countDocuments()
      ]);

    res.json({
      totalDonors,
      totalVolunteers,
      totalNGOs,
      totalDonations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ================= RECENT DONATIONS ================= */
exports.getRecentDonations = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const donations = await Donation.find()
      .populate("donor", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ================= ALL VOLUNTEERS ================= */
exports.getAllVolunteers = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const volunteers = await User.find({ role: "volunteer" }).select("-password");
    res.json(volunteers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ================= ALL DONATIONS ================= */
exports.getAllDonations = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const donations = await Donation.find()
      .populate("donor", "name email")
      .populate("ngo", "name email");

    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
