import Like from "../models/Like.js";
import Video from "../models/Video.js";

export const handleReaction = async (req, res) => {
  const { userId, type } = req.body;
  const { videoId } = req.params;

  try {
    const existing = await Like.findOne({
      viewer: userId,
      videoid: videoId,
    });

    // 🔁 SAME CLICK → REMOVE
    if (existing && existing.type === type) {
      await Like.findByIdAndDelete(existing._id);

      await Video.findByIdAndUpdate(videoId, {
        $inc: {
          likes: type === "like" ? -1 : 0,
          dislikes: type === "dislike" ? -1 : 0,
        },
      });
    }

    // 🔁 SWITCH LIKE ↔ DISLIKE
    else if (existing && existing.type !== type) {
      await Like.findByIdAndDelete(existing._id);

      await Video.findByIdAndUpdate(videoId, {
        $inc: {
          likes: existing.type === "like" ? -1 : 1,
          dislikes: existing.type === "dislike" ? -1 : 1,
        },
      });

      await Like.create({
        viewer: userId,
        videoid: videoId,
        type,
      });
    }

    // ❤️ NEW REACTION
    else {
      await Like.create({
        viewer: userId,
        videoid: videoId,
        type,
      });

      await Video.findByIdAndUpdate(videoId, {
        $inc: {
          likes: type === "like" ? 1 : 0,
          dislikes: type === "dislike" ? 1 : 0,
        },
      });
    }

    const updated = await Video.findById(videoId);

    res.json({
      liked: type === "like",
      disliked: type === "dislike",
      likes: updated.likes,
      dislikes: updated.dislikes,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};