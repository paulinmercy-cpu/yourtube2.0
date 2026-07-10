import express from "express";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

import {
  downloadVideo,
  getDownloads,
} from "../controllers/download.js";

const router = express.Router();

console.log("✅ Download routes loaded");

// 📥 Save download (with limit logic)
router.post("/", downloadVideo);
router.post("/", downloadVideo);

// FILE DOWNLOAD ROUTE
router.get("/file/:filename", (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.resolve("uploads", filename);

    console.log("Download request:", filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    return res.download(filePath);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// GET DOWNLOADS
router.get("/:userId", getDownloads);

// 📂 Get user downloads
router.get("/:userId", getDownloads);

// 📥 FILE DOWNLOAD ROUTE (FIXED)
router.get("/file/:filename", (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.resolve("uploads", filename);

    console.log("📥 Download request:", filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    return res.download(filePath);
  } catch (error) {
    console.log("FILE DOWNLOAD ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
});

export default router;