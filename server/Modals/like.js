import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles", // ✅ match your Video model name
      required: true,
    },

    userId: {
      type: String,
      required: true, // ✅ MUST be true
    },

    type: {
      type: String,
      enum: ["like", "dislike"],
      required: true, // ✅ better than default
    },
  },
  {
    timestamps: true,
  }
);

// ✅ IMPORTANT: prevent duplicate reactions (1 user → 1 video)
likeSchema.index({ videoId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Like ||
  mongoose.model("Like", likeSchema);