import Video from "../Modals/video.js";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

ffmpeg.setFfmpegPath("ffmpeg");
ffmpeg.setFfprobePath("ffprobe");
// ================= UPLOAD VIDEO =================
export const uploadVideo = async (req, res) => {
  try {
    const {
      videotitle,
      videochannel,
      category,
      uploader,
    } = req.body;

    const videoFile =
      req.files?.video && req.files.video.length
        ? req.files.video[0]
        : null;

    if (!videoFile) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    // Generate thumbnail filename
    const thumbnailName =
      Date.now() + "-thumbnail.jpg";

    const thumbnailPath = path.join(
      "uploads",
      thumbnailName
    );

    // Generate thumbnail using FFmpeg
    console.log("Generating thumbnail...");
console.log("Video:", videoFile.path);
console.log("Thumbnail:", thumbnailName);

await new Promise((resolve, reject) => {
  ffmpeg(videoFile.path)
    .on("start", (commandLine) => {
      console.log("FFmpeg started:");
      console.log(commandLine);
    })
    .on("end", () => {
      console.log("Thumbnail generated successfully!");
      resolve();
    })
    .on("error", (err) => {
      console.error("FFmpeg Error:", err);
      reject(err);
    })
    .screenshots({
      count: 1,
      folder: "uploads",
      filename: thumbnailName,
      size: "640x360",
    });
});

    // Save video in MongoDB
    const video = new Video({
      videotitle,
      filename: videoFile.filename,
      filetype: videoFile.mimetype,
      filepath: videoFile.path,
      filesize: videoFile.size,
      videochannel,
      category,
      uploader,
      thumbnail: thumbnailName,
      avatar: "",
    });

    const savedVideo = await video.save();

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video: savedVideo,
    });
  } catch (error) {
  console.error("UPLOAD ERROR FULL:", error); // ADD THIS

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

// ================= GET ALL VIDEOS =================
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({
      createdAt: -1,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const videosWithUrls = videos.map((video) => ({
      ...video._doc,

      videoUrl: `${baseUrl}/uploads/${video.filename}`,

      thumbnailUrl: video.thumbnail
        ? `${baseUrl}/uploads/${video.thumbnail}`
        : "",
    }));

    res.status(200).json({
      success: true,
      count: videos.length,
      videos: videosWithUrls,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

// ================= GET VIDEO BY ID =================
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://yourtube2-0-3-15aa.onrender.com";

    res.status(200).json({
      success: true,
      video: {
        ...video._doc,
        videoUrl: `${baseUrl}/uploads/${video.filename}`,
        thumbnailUrl: video.thumbnail
          ? `${baseUrl}/uploads/${video.thumbnail}`
          : "",
      },
    });
  } catch (error) {
    console.error("GET VIDEO ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LIKE VIDEO =================
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          likes: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DISLIKE VIDEO =================
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          dislikes: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= ADD VIEW =================
export const addView = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          views: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= WATCH LATER =================
export const addWatchLater = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          watchLater: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};