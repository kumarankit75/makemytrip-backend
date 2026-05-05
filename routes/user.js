import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Get profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, gender, dob } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, gender, dob },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated!", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Change password
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

    res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;