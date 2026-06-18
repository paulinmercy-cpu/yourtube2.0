import like from "../Modals/like.js";
import video from "../Modals/video.js";

export const handlelike = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;

  try {
    // ✅ CHECK VIDEO EXISTS (added)
    const videoExists = await video.findById(videoId);
    if (!videoExists) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    const existinglike = await like.findOne({
      viewer: userId,
      videoid: videoId,
    });

    // 🔁 UNLIKE
    if (existinglike) {
      await like.findByIdAndDelete(existinglike._id);

      // ✅ PREVENT NEGATIVE LIKES (added)
      const videoData = await video.findById(videoId);

      if (videoData.likes > 0) {
        await video.findByIdAndUpdate(videoId, {
          $inc: { likes: -1 },
        });
      }

      const updatedVideo = await video.findById(videoId);

      return res.status(200).json({
        liked: false,
        likes: updatedVideo?.likes || 0, // ✅ SAFE
      });
    }

    // ❤️ LIKE
    await like.create({
      viewer: userId,
      videoid: videoId,
    });

    await video.findByIdAndUpdate(videoId, {
      $inc: { likes: 1 },
    });

    const updatedVideo = await video.findById(videoId);

    return res.status(200).json({
      liked: true,
      likes: updatedVideo?.likes || 0, // ✅ SAFE
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


// ✅ GET ALL LIKED VIDEOS
export const getalllikedVideo = async (req, res) => {
  const { userId } = req.params;

  try {
    const likevideo = await like
      .find({ viewer: userId })
      .populate({
        path: "videoid",
        model: "videofiles",
      });

    return res.status(200).json(likevideo);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};