import Download from "../modals/download.js";

export const downloadVideo = async (req, res) => {
  try {
    const { userId, videoId, title, url } = req.body;

    console.log("DOWNLOAD BODY:", req.body);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await Download.countDocuments({
      userId,
      createdAt: { $gte: today },
    });

    console.log("DOWNLOAD COUNT:", count);

    // TEMPORARY: disable limit for testing
    /*
    if (count >= 1) {
      return res.json({
        success: false,
        premiumRequired: true,
        message:
          "Upgrade to Premium for unlimited downloads",
      });
    }
    */

    const download = await Download.create({
      userId,
      videoId,
      videoTitle: title,
      videoUrl: url,
    });

    res.json({
      success: true,
      download,
    });
  } catch (error) {
    console.log("DOWNLOAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET DOWNLOADED VIDEOS
export const getDownloads = async (req, res) => {
  try {
    const { userId } = req.params;

    const downloads = await Download.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      downloads,
    });
  } catch (error) {
    console.log("GET DOWNLOADS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};