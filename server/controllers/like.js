import Like from "../Modals/like.js";
import Video from "../Modals/video.js";

// ===============================
// LIKE / UNLIKE VIDEO
// ===============================
export const handlelike = async (req, res) => {
  try {
    const { userId } = req.body;
    const { videoId } = req.params;

    console.log("BODY:", req.body);
    console.log("PARAMS:", req.params);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: "videoId is required",
      });
    }

    // Check video exists
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Check if already liked
    const existingLike = await Like.findOne({
      userId,
      videoId,
      type: "like",
    });

    // ===============================
    // UNLIKE
    // ===============================
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);

      if (video.likes > 0) {
        video.likes -= 1;
      }

      await video.save();

      return res.status(200).json({
        success: true,
        liked: false,
        likes: video.likes,
      });
    }

    // ===============================
    // LIKE
    // ===============================
    await Like.create({
      userId,
      videoId,
      type: "like",
    });

    video.likes += 1;

    await video.save();

    return res.status(200).json({
      success: true,
      liked: true,
      likes: video.likes,
    });
  } catch (error) {
    console.error("LIKE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL LIKED VIDEOS
// ===============================
export const getalllikedVideo = async (req, res) => {
  try {
    const { userId } = req.params;

    const likedVideos = await Like.find({
      userId,
      type: "like",
    }).populate({
      path: "videoId",
      model: "videofiles",
    });

    return res.status(200).json({
      success: true,
      videos: likedVideos,
    });
  } catch (error) {
    console.error("GET LIKED VIDEOS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};