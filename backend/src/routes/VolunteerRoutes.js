const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const volunteerController = require("../controllers/VolunteerController");

// Optional: restrict only to volunteers
function volunteerOnly(req, res, next) {
  if (req.user.role !== "volunteer") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}

// Dashboard route
router.get("/dashboard", auth, volunteerOnly, volunteerController.getVolunteerDashboard);

// Update donation status
router.put("/donation/:id/status", auth, volunteerOnly, volunteerController.updateDonationStatus);

module.exports = router;
