import express from "express";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import adminMiddleware from "../middleware/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Admin Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    // Check admin secret
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid admin secret" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: true },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isAdmin) {
      return res.status(400).json({ message: "Invalid credentials or not an admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: true },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get dashboard stats
router.get("/stats", adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalBookings = await Booking.countDocuments();
    const flightBookings = await Booking.countDocuments({ bookingType: "flight" });
    const hotelBookings = await Booking.countDocuments({ bookingType: "hotel" });
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    res.status(200).json({
      totalUsers,
      totalBookings,
      flightBookings,
      hotelBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all users
router.get("/users", adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all bookings
router.get("/bookings", adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete user
router.delete("/users/:id", adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;