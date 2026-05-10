import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import authMiddleware from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import { bookingConfirmationTemplate } from "../utils/emailTemplates.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: "MMT" + Date.now().toString().slice(-8),
    });

    res.status(200).json({ order });
  } catch (error) {
    console.log("Razorpay error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Verify payment & create booking
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
      type,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Create booking
    const bookingId = "MMT" + Date.now().toString().slice(-8);
    const booking = await Booking.create({
      user: req.user.id,
      bookingType: type,
      ...(type === "flight"
        ? { flight: bookingData.flight, passengers: bookingData.passengers }
        : { hotel: bookingData.hotel, guests: bookingData.guests, checkIn: bookingData.checkIn, checkOut: bookingData.checkOut, rooms: bookingData.rooms }
      ),
      totalPrice: bookingData.totalPrice,
      bookingId,
      paymentId: razorpay_payment_id,
      paymentStatus: "paid",
    });

    // Send confirmation email
    const user = await User.findById(req.user.id);
    await sendEmail({
      to: user.email,
      subject: `Booking Confirmed! ${bookingId} 🎉`,
      html: bookingConfirmationTemplate(booking),
    });

    res.status(201).json({ message: "Payment verified & booking confirmed!", booking });
  } catch (error) {
    console.log("Verify error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;