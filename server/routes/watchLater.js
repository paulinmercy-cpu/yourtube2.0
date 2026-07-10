import express from "express";

import {
  handleWatchLater,
  getWatchLaterVideos,
} from "../controllers/watchLater.js";

const router = express.Router();

router.post("/:videoId", handleWatchLater);

router.get("/:userId", getWatchLaterVideos);

export default router;