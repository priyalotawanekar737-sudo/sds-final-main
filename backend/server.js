const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");

dotenv.config();

const connectDB = require("./src/config/db");

const app = express();

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================== ROUTES ==================
// Test Route
app.get("/", (req, res) => {
  res.send("Smart Donation System API is running 🚀");
});

// Auth Routes
app.use("/api/auth", require("./src/routes/auth"));

// Donation Routes
app.use("/api/donations", require("./src/routes/donations"));

// Volunteer Routes
app.use("/api/volunteer", require("./src/routes/VolunteerRoutes"));

// Users Routes (Important for NGO → Assign Volunteer)
app.use("/api/users", require("./src/routes/users"));

// Notification Routes
app.use("/api/notifications", require("./src/routes/notificationRoutes"));

// Admin NGO Routes
app.use("/api/admin/ngo", require("./src/routes/ngoRoutes"));

// Admin Routes
app.use("/api/admin", require("./src/routes/adminRoutes"));

// ================== 404 HANDLER ==================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ================== GLOBAL ERROR HANDLER ==================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    message: "Internal Server Error",
  });
});

// ================== START SERVER ==================
const startServer = async () => {
  try {
    await connectDB();

    console.log("🔥 Connected to DB:", mongoose.connection.name);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();