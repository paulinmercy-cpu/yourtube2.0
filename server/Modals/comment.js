import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles",
      required: true,
    },

    usercommented: {
      type: String,
      required: true,
      trim: true,
    },

    commentbody: {
      type: String,
      required: true,
      trim: true,
    },

    // Task 1 - User City
    city: {
      type: String,
      default: "Unknown",
    },

    commentedon: {
      type: Date,
      default: Date.now,
    },

    // Task 1 - Like Count
    likes: {
      type: Number,
      default: 0,
    },

    // Task 1 - Dislike Count
    dislikes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Comment =
  mongoose.models.Comment ||
  mongoose.model("Comment", commentSchema);

export default Comment;