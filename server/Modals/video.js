import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    videotitle: {
      type: String,
      required: true,
    },

    filename: {
      type: String,
      required: true,
    },

    filetype: {
      type: String,
      required: true,
    },

    filepath: {
      type: String,
      required: true,
    },
    

channelName: {
  type: String,
  default: "",
},

    // FIXED: ensure number consistency
    filesize: {
      type: Number,
      required: true,
    },

    videochannel: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    // FIXED: naming convention
    likes: {
      type: Number,
      default: 0,
    },

    // NEW: YouTube-style
    dislikes: {
      type: Number,
      default: 0,
    },

    watchLater: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    uploader: {
      type: String,
      required: true,
    },

    // better for calculations
    duration: {
      type: Number,
      default: 0, // seconds
    },

    thumbnail: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error
export default mongoose.models.videofiles ||
  mongoose.model("videofiles", videoSchema);