const Ngo = require("../models/ngo");

/**
 * ===============================
 * GET ALL NGOs (ADMIN)
 * ===============================
 */
exports.getAllNgos = async (req, res) => {
  try {
    // Admin check (from auth middleware)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const ngos = await Ngo.find().sort({ createdAt: -1 });
    res.status(200).json(ngos);
  } catch (error) {
    console.error("Get NGOs error:", error.message);
    res.status(500).json({ message: "Failed to fetch NGOs" });
  }
};

/**
 * ===============================
 * ADD NGO (ADMIN / PUBLIC)
 * ===============================
 */
exports.addNgo = async (req, res) => {
  try {
    const { name, email, city } = req.body;

    if (!name || !email || !city) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingNgo = await Ngo.findOne({ email });
    if (existingNgo) {
      return res.status(400).json({ message: "NGO already exists" });
    }

    const ngo = new Ngo({
      name,
      email,
      city,
      status: "pending",
    });

    await ngo.save();
    res.status(201).json({ message: "NGO added successfully", ngo });
  } catch (error) {
    console.error("Add NGO error:", error.message);
    res.status(500).json({ message: "Failed to add NGO" });
  }
};

/**
 * ===============================
 * UPDATE NGO STATUS (ADMIN)
 * ===============================
 */
exports.updateNgoStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;
    const validStatus = ["approved", "rejected", "pending"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const ngo = await Ngo.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    res.status(200).json({ message: "Status updated", ngo });
  } catch (error) {
    console.error("Update NGO error:", error.message);
    res.status(500).json({ message: "Failed to update status" });
  }
};

/**
 * ===============================
 * DELETE NGO (ADMIN)
 * ===============================
 */
exports.deleteNgo = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const ngo = await Ngo.findByIdAndDelete(req.params.id);

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    res.status(200).json({ message: "NGO deleted successfully" });
  } catch (error) {
    console.error("Delete NGO error:", error.message);
    res.status(500).json({ message: "Failed to delete NGO" });
  }
};
