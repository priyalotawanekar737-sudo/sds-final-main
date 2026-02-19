const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./src/models/User"); // adjust if path differs

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  try {
    const existingAdmin = await User.findOne({ email: "admin@donation.com" });

    if (existingAdmin) {
      console.log("Admin already exists");
      mongoose.connection.close();
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "System Admin",
      email: "admin@donation.com",
      password: hashedPassword,
      role: "admin",
      approved: true,
    });

    console.log("✅ Admin created successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

createAdmin();
