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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({
  storage,
});

router.post(
  "/upload",
  upload.single("video"),
  uploadVideo
);

router.get("/", getVideos);

// GET VIDEO BY ID
router.get("/:id", getVideoById);


router.put("/:id/like", likeVideo);
router.put("/:id/dislike", dislikeVideo);
router.put("/:id/view", addView);
router.put("/:id/watchlater", addWatchLater);


export default router;