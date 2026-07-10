import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    default: "",
  },

  channelname: {
    type: String,
    default: "",
  },

  description: {
    type: String,
    default: "",
  },

  image: {
    type: String,
    default: "",
  },

  // ⭐ User phone number
  phone: {
    type: String,
    default: "",
  },

  // ⭐ User state (Task 4)
  state: {
    type: String,
    default: "",
  },

  // ⭐ OTP for login verification
  otp: {
    type: String,
    default: "",
  },

  otpExpiry: {
    type: Date,
    default: null,
  },

  // ⭐ Premium Plan (Task 3)
  plan: {
    type: String,
    enum: ["Free", "Bronze", "Silver", "Gold"],
    default: "Free",
  },

  joinedon: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("user", userschema);