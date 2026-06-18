import Video from "../Modals/video.js";

// UPLOAD VIDEO
export const uploadVideo = async (req, res) => {
  try {
    const {
      videotitle,
      videochannel,
      category,
      uploader,
    } = req.body;

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Video file required",
      });
    }

    const video = new Video({
      videotitle,
      filename: file.filename,
      filetype: file.mimetype,
      filepath: file.path,
      filesize: file.size,
      videochannel,
      category,
      uploader,
      thumbnail: "",
      avatar: "",
    });

    const savedVideo = await video.save();

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video: savedVideo,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL VIDEOS
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({
      createdAt: -1,
    });

    const videosWithUrl = videos.map((video) => ({
      ...video._doc,
      videoUrl: `http://localhost:5000/${video.filepath.replace(
        /\\/g,
        "/"
      )}`,
    }));

    res.status(200).json({
      success: true,
      count: videos.length,
      videos: videosWithUrl,
    });
  } catch (error) {
    console.error("GET VIDEOS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
    });
  }
};

// GET SINGLE VIDEO
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

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
    console.error("GET VIDEO ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LIKE VIDEO
export const likeVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
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
    console.error("LIKE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DISLIKE VIDEO
export const dislikeVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { dislikes: 1 } },
      { new: true }
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
    console.error("DISLIKE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADD VIEW
export const addView = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
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
    console.error("VIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADD WATCH LATER
export const addWatchLater = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndUpdate(
      id,
      {
        $inc: { watchLater: 1 },
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
    console.error("WATCH LATER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};