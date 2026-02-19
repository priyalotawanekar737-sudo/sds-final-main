const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");

// ✅ ADD NOTIFICATION (FIXED)
router.post("/", async (req, res) => {
  try {
    const { message, role } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    const newNotification = new Notification({
      message,
      role: role || "admin",
      isRead: false
    });

    await newNotification.save();

    res.status(201).json({
      success: true,
      notification: newNotification
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save notification" });
  }
});

// ✅ GET ADMIN NOTIFICATIONS
router.get("/admin", async (req, res) => {
  try {
    const notifications = await Notification.find({ role: "admin" })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// ✅ MARK AS READ
router.put("/:id/read", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error updating notification" });
  }
});

// DELETE notification
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});


module.exports = router;
