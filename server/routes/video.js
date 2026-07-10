import express from "express";
import multer from "multer";

import {
  uploadVideo,
  getVideos,
  getVideoById,
  likeVideo,
  dislikeVideo,
  addView,
  addWatchLater,
} from "../controllers/video.js";

const router = express.Router();

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
});

// ================= Upload Video =================
router.post(
  "/upload",
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

// ================= Get All Videos =================
router.get("/", getVideos);

// ================= Get Single Video =================
router.get("/:id", getVideoById);

// ================= Like =================
router.put("/:id/like", likeVideo);

// ================= Dislike =================
router.put("/:id/dislike", dislikeVideo);

// ================= View =================
router.put("/:id/view", addView);

// ================= Watch Later =================
router.put("/:id/watchlater", addWatchLater);

export default router;