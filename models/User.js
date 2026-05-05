import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);