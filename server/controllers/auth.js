import mongoose from "mongoose";
import users from "../Modals/Auth.js";
import { generateOTP } from "../filehelper/sendOTP.js";

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, name, image, phone, state } = req.body;

    console.log("LOGIN BODY:", req.body);

    // ✅ Validate email
    if (!email || email.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    let existinguser = await users.findOne({ email });

    // ✅ Create user if not exists
    if (!existinguser) {
      existinguser = await users.create({
        email,
        name: name || "",
        image: image || "",
        phone: phone || "",
        state: state || "",
      });
    } else {
      // ✅ Update existing user
      existinguser.name = name || existinguser.name;
      existinguser.image = image || existinguser.image;
      existinguser.phone = phone || existinguser.phone;
      existinguser.state = state || existinguser.state;
    }

    // ✅ Generate OTP (always string)
    const otp = generateOTP().toString();

    existinguser.otp = otp;
    existinguser.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await existinguser.save();

    console.log("Generated OTP:", otp);

    // ✅ Return OTP (DEV mode)
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
      message: "Server error",
    });
  }
};

// ================= VERIFY OTP =================
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    // ✅ Validate input
    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "UserId and OTP are required",
      });
    }

    // ✅ Check valid Mongo ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ FIXED OTP COMPARISON
    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ Check expiry
    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // ✅ Clear OTP after success
    user.otp = "";
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user,
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= GET USER =================
export const getUser = async (req, res) => {
  const { id } = req.params;

  // ✅ Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid User ID",
    });
  }

  try {
    const user = await users.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= UPDATE PROFILE =================
export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelname, description } = req.body;

  // ✅ Validate ID
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  try {
    const updatedUser = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          channelname: channelname || "",
          description: description || "",
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};