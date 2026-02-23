const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },

    // 📍 Location (used for filtering)
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },

    // 🔁 Donation lifecycle
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "assigned",
        "on_the_way",
        "collected",
        "completed",
      ],
      default: "pending",
    },

    // NGO who accepted
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Volunteer assigned
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // 📸 Proof uploaded after completion
    proofImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
