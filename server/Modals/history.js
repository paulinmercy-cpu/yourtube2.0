import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    videoId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "videofiles",
  required: true,
},
    watchedOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("History", historySchema);