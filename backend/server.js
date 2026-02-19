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

// 📸 Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================== DATABASE ==================
const startServer = async () => {
  try {
    // Connect DB
    await connectDB();

    // 🔥 Debug: Print connected database name
    console.log("🔥 Connected to DB:", mongoose.connection.name);

    // 🔥 Debug: Print URI database part
    if (process.env.MONGO_URI) {
      const dbNameFromURI = process.env.MONGO_URI.split(".net/")[1]?.split("?")[0];
      console.log("📌 DB from URI:", dbNameFromURI);
    }

    // ================== TEST ROUTE ==================
    app.get("/", (req, res) => {
      res.send("Smart Donation System API is running 🚀");
    });

    // ================== ROUTES ==================
    app.use("/api/auth", require("./src/routes/auth"));
    app.use("/api/donations", require("./src/routes/donations"));
    app.use("/api/volunteer", require("./src/routes/VolunteerRoutes"));

    app.use("/api/users", require("./src/routes/users"));
    app.use("/api/notifications", require("./src/routes/notificationRoutes"));
    app.use("/api/admin/ngo", require("./src/routes/ngoRoutes"));
    app.use("/api/admin", require("./src/routes/adminRoutes"));
    
   

    


    // ================== ADMIN DASHBOARD STATS ==================
    const auth = require("./src/middleware/auth");
    const User = require("./src/models/User");
    const Donation = require("./src/models/Donation");
   

    

    // ================== ERROR HANDLER ==================
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: "Something went wrong!" });
    });

    // ================== START SERVER ==================
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
