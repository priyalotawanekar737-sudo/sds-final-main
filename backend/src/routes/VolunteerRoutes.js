const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const volunteerController = require("../controllers/VolunteerController");

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Optional: restrict only to volunteers
function volunteerOnly(req, res, next) {
  if (req.user.role !== "volunteer") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}

// Dashboard route
router.get("/dashboard", auth, volunteerOnly, volunteerController.getVolunteerDashboard);

// Upload image (free upload)
router.post("/upload-image", auth, volunteerOnly, upload.single("image"), volunteerController.uploadImage);

// Get all images uploaded by this volunteer
router.get("/my-images", auth, volunteerOnly, volunteerController.getMyImages);

// Update donation status
router.put("/donation/:id/status", auth, volunteerOnly, volunteerController.updateDonationStatus);

module.exports = router;
