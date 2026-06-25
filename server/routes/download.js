import express from "express";
import {
  downloadVideo,
  getDownloads,
} from "../controllers/download.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Download route working",
  });
});

router.post("/", downloadVideo);

router.get("/:userId", getDownloads);

export default router;