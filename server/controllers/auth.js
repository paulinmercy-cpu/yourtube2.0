import mongoose from "mongoose";
import users from "../Modals/Auth.js";
import { generateOTP } from "../filehelper/sendOTP.js";

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, name, image, phone, state } = req.body;

    console.log("LOGIN BODY:", req.body);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    let existinguser = await users.findOne({ email });

    if (!existinguser) {
      existinguser = await users.create({
        email,
        name,
        image,
        phone,
        state,
      });
    } else {
      existinguser.name = name || existinguser.name;
      existinguser.image = image || existinguser.image;
      existinguser.phone = phone || existinguser.phone;
      existinguser.state = state || existinguser.state;
    }

    // Generate OTP
    const otp = generateOTP();

    existinguser.otp = otp;
    existinguser.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await existinguser.save();

    console.log("Generated OTP:", otp);

    // Development mode: return OTP instead of sending email
    return res.status(200).json({
      success: true,
      message: "OTP generated successfully",
      userId: existinguser._id,
      otp,
      state: existinguser.state,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= VERIFY OTP =================
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.otp = "";
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      result: user,
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET USER =================
export const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid User ID",
    });
  }

  try {
    const user = await users.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get User Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// ================= UPDATE PROFILE =================
export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelname, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({
      message: "User unavailable...",
    });
  }

  try {
    const updatedData = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          channelname,
          description,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json(updatedData);
  } catch (error) {
    console.error("Update error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};