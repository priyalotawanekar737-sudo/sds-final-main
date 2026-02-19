const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path"); // <-- add this line
const User = require(path.resolve(__dirname, "src", "models", "User.js")); // <-- correct path
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const volunteers = [
  { name: "vol1", email: "vol1@donation.com" },
  { name: "vol2", email: "vol2@donation.com" },
  { name: "vol3", email: "vol3@donation.com" },
  { name: "vol4", email: "vol4@donation.com" },
  { name: "vol5", email: "vol5@donation.com" },
];

const User = require("./src/models/User"); 

async function createVolunteers() {
  try {
    for (let vol of volunteers) {
      const existing = await User.findOne({ email: vol.email });
      if (existing) {
        console.log(`Volunteer ${vol.email} already exists`);
        continue;
      }

      const hashedPassword = await bcrypt.hash("volunteer123", 10);

      await User.create({
        name: vol.name,
        email: vol.email,
        password: hashedPassword,
        role: "volunteer",
        approved: true,
      });

      console.log(`Created volunteer: ${vol.email}`);
    }
    console.log("All volunteers processed!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

createVolunteers();
