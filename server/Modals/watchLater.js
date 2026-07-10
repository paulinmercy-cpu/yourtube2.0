import mongoose from "mongoose";

const watchLaterSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles",
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user can save one video only once
watchLaterSchema.index(
  { videoId: 1, userId: 1 },
  { unique: true }
);

export default mongoose.models.WatchLater ||
  mongoose.model("WatchLater", watchLaterSchema);