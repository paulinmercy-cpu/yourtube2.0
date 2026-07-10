import users from "../Modals/Auth.js";
import { sendInvoice } from "../filehelper/sendEmail.js";

export const upgradePlan = async (req, res) => {
  try {
    const { userId, plan } = req.body;

    if (!userId || !plan) {
      return res.status(400).json({
        success: false,
        message: "User ID and plan are required",
      });
    }

    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { plan },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send invoice email
    await sendInvoice(
      updatedUser.email,
      updatedUser.name,
      updatedUser.plan
    );

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error("UPGRADE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};