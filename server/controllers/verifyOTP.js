import users from "../Modals/Auth.js";

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

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.otp = "";
    user.otpExpiry = null;

    await user.save();

    res.json({
      success: true,
      message: "Login Successful",
      result: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};