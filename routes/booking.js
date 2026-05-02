import express from "express";
import Booking from "../models/Booking.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create flight booking
router.post("/flight", authMiddleware, async (req, res) => {
  try {
    const { flight, passengers, totalPrice } = req.body;
    const bookingId = "MMT" + Date.now().toString().slice(-8);

    const booking = await Booking.create({
      user: req.user.id,
      bookingType: "flight",
      flight,
      passengers,
      totalPrice,
      bookingId,
    });

    res.status(201).json({ message: "Flight booking confirmed!", booking });
  } catch (error) {
    console.log("Booking error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create hotel booking
router.post("/hotel", authMiddleware, async (req, res) => {
  try {
    const { hotel, guests, checkIn, checkOut, rooms, totalPrice } = req.body;
    const bookingId = "MMT" + Date.now().toString().slice(-8);

    const booking = await Booking.create({
      user: req.user.id,
      bookingType: "hotel",
      hotel,
      guests,
      checkIn,
      checkOut,
      rooms,
      totalPrice,
      bookingId,
    });

    res.status(201).json({ message: "Hotel booking confirmed!", booking });
  } catch (error) {
    console.log("Booking error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get my bookings
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;