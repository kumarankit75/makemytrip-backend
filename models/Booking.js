import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    flight: {
      airline: String,
      flightNumber: String,
      from: String,
      to: String,
      departure: String,
      arrival: String,
      duration: String,
      price: Number,
      type: String,
    },
    passengers: [
      {
        name: String,
        age: Number,
        gender: String,
      },
    ],
    totalPrice: Number,
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    bookingId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);