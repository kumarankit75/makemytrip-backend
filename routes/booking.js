import express from "express";
import Booking from "../models/Booking.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create booking
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { flight, passengers, totalPrice } = req.body;

//     // Generate unique booking ID
//     const bookingId = "MMT" + Date.now().toString().slice(-8);

//     const booking = await Booking.create({
//       user: req.user.id,
//       flight,
//       passengers,
//       totalPrice,
//       bookingId,
//     });

//     res.status(201).json({
//       message: "Booking confirmed!",
//       booking,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });



// Create booking
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { flight, passengers, totalPrice } = req.body;
    
    console.log("Booking request received:", req.body); // ADD THIS
    console.log("User from token:", req.user); // ADD THIS

    const bookingId = "MMT" + Date.now().toString().slice(-8);

    const booking = await Booking.create({
      user: req.user.id,
      flight,
      passengers,
      totalPrice,
      bookingId,
    });

    console.log("Booking created:", booking); // ADD THIS

    res.status(201).json({
      message: "Booking confirmed!",
      booking,
    });
  } catch (error) {
    console.log("Booking error:", error.message); // ADD THIS
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