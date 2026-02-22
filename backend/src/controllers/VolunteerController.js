const Donation = require("../models/Donation");
const Users = require("../models/User");
const VolunteerImage = require("../models/VolunteerImage");
const mongoose = require("mongoose");

// GET volunteer dashboard
exports.getVolunteerDashboard = async (req, res) => {
  try {
    const volunteerId = new mongoose.Types.ObjectId(req.user.id); // from JWT middleware
    const totalDonations = await Donation.countDocuments();
    const approvedDonors = await Donation.find({ status: "accepted" });
    const onGoingDonors = await Donation.find({ status: "pending" });

    // Fetch all assigned/accepted donations not assigned to this volunteer (available pool)
    const allAssigned = await Donation.find({
      status: { $in: ["accepted", "assigned", "pending"] },
      volunteerId: { $ne: volunteerId }
    })
      .populate("donor", "name")
      .sort({ createdAt: -1 });

    // Fetch volunteer's donations (assigned, ongoing, completed)
    const myDonations = await Donation.find({
      volunteerId,
      status: { $in: ["accepted", "assigned", "pending", "on_the_way", "collected", "delivered"] }
    })
      .populate("donor", "name")
      .sort({ createdAt: -1 });


    console.log("approvedDonors", approvedDonors);
    console.log("onGoingDonors", onGoingDonors);
    console.log("User ID from JWT:", req.user.id);
    console.log("All assigned donations:", allAssigned.length);
    console.log("My donations:", myDonations.length);

    // Format donations for frontend (available + my current)
    const formattedAssigned = allAssigned.map(d => ({
      _id: d._id,
      donorName: d.donor?.name || "Unknown",
      location: `${d.city}, ${d.state}`,
      status: d.status
    }));

    const formattedMy = myDonations.map(d => ({
      _id: d._id,
      donorName: d.donor?.name || "Unknown",
      location: `${d.city}, ${d.state}`,
      status: d.status
    }));

    const formattedDonations = [...formattedAssigned, ...formattedMy];

    // Compute dashboard counts
    const summary = {
      // assigned: allAssigned.length + myDonations.filter(d => d.status === "accepted" || d.status === "assigned" || d.status === "pending").length,
      assigned: totalDonations,
      ongoing: onGoingDonors.length,
      completed: myDonations.filter(d => d.status === "delivered" || d.status === "accepted").length
    };

    res.json({
      summary,
      donations: formattedDonations
    });

  } catch (err) {
    console.error("Error in getVolunteerDashboard:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPLOAD image (free upload, not tied to a donation)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file provided" });

    const image = await VolunteerImage.create({
      volunteerId: req.user.id,
      imagePath: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({ message: "Image uploaded successfully", image });
  } catch (err) {
    console.error("Error in uploadImage:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all images uploaded by this volunteer
exports.getMyImages = async (req, res) => {
  try {
    const images = await VolunteerImage.find({ volunteerId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ images });
  } catch (err) {
    console.error("Error in getMyImages:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE donation status
exports.updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;       // donation ID from URL
    const { status } = req.body;     // new status from request body

    const donation = await Donation.findById(id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    // If taking a donation, set volunteerId
    if (!donation.volunteerId) {
      donation.volunteerId = new mongoose.Types.ObjectId(req.user.id);
    }

    donation.status = status;
    await donation.save();

    res.json({ message: "Status updated", donation });
  } catch (err) {
    console.error("Error in updateDonationStatus:", err);
    res.status(500).json({ message: "Server error" });
  }
};
