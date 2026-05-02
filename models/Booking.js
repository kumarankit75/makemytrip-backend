import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
  id: Number,
  airline: String,
  flightNumber: String,
  from: String,
  fromCode: String,
  to: String,
  toCode: String,
  departure: String,
  arrival: String,
  duration: String,
  price: Number,
  seats: Number,
  type: String,
});

const hotelSchema = new mongoose.Schema({
  id: Number,
  name: String,
  location: String,
  rating: Number,
  price: Number,
  originalPrice: Number,
  roomType: String,
  amenities: [String],
  image: String,
});

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingType: {
      type: String,
      enum: ["flight", "hotel"],
      required: true,
    },
    flight: flightSchema,
    hotel: hotelSchema,
    checkIn: String,
    checkOut: String,
    rooms: Number,
    passengers: [
      {
        name: String,
        age: Number,
        gender: String,
      },
    ],
    guests: [
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