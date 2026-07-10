import WatchLater from "../Modals/watchLater.js";
import Video from "../Modals/video.js";

// ===================================
// ADD / REMOVE WATCH LATER
// ===================================
export const handleWatchLater = async (req, res) => {
  try {
    const { userId } = req.body;
    const { videoId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const existing = await WatchLater.findOne({
      userId,
      videoId,
    });

    // REMOVE FROM WATCH LATER
    if (existing) {
      await WatchLater.findByIdAndDelete(existing._id);

      if (video.watchLater > 0) {
        video.watchLater -= 1;
      }

      await video.save();

      return res.status(200).json({
        success: true,
        saved: false,
        watchLater: video.watchLater,
      });
    }

    // ADD TO WATCH LATER
    await WatchLater.create({
      userId,
      videoId,
    });

    video.watchLater += 1;

    await video.save();

    return res.status(200).json({
      success: true,
      saved: true,
      watchLater: video.watchLater,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ===================================
// GET WATCH LATER VIDEOS
// ===================================
export const getWatchLaterVideos = async (req, res) => {
  try {
    const { userId } = req.params;

    const videos = await WatchLater.find({
      userId,
    }).populate({
      path: "videoId",
      model: "videofiles",
    });

    return res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};