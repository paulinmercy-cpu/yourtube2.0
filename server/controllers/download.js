import Download from "../modals/download.js";
import mongoose from "mongoose";

// 📥 DOWNLOAD VIDEO + LIMIT LOGIC
export const downloadVideo = async (req, res) => {
  try {
    const {
  userId,
  videoId,
  title,
  url,
  thumbnail,
  channelName,
  isPremium,
} = req.body;

    console.log("DOWNLOAD BODY:", req.body);

    // ❌ VALIDATION FIX (IMPORTANT)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId (must be MongoDB ObjectId)",
      });
    }

    // 🧠 TODAY START
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔥 COUNT TODAY DOWNLOADS
    const count = await Download.countDocuments({
      userId,
      createdAt: { $gte: today },
    });

    console.log("TODAY DOWNLOAD COUNT:", count);

    // ❌ LIMIT FOR FREE USERS
    if (!isPremium && count >= 1) {
      return res.status(403).json({
        success: false,
        premiumRequired: true,
        message: "Upgrade to Premium for unlimited downloads",
      });
    }

    // 💾 SAVE DOWNLOAD
    const download = await Download.create({
  userId,
  videoId,
  videoTitle: title,
  videoUrl: url,
  thumbnail,
  channelName,
});

    return res.json({
      success: true,
      download,
    });

  } catch (error) {
    console.log("DOWNLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📂 GET USER DOWNLOADS
export const getDownloads = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    const downloads = await Download.find({ userId }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      downloads,
    });
  } catch (error) {
    console.log("GET DOWNLOADS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};