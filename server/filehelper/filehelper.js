import path from "path";
import fs from "fs";

/* 🔥 Generate safe unique filename */
export const generateFileName = (originalName) => {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);

  return `${Date.now()}-${name.replace(/\s+/g, "-")}${ext}`;
};

/* 🔥 Check if file type is valid video */
export const isValidVideo = (mimetype) => {
  const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];

  return allowedTypes.includes(mimetype);
};

/* 🔥 Ensure upload folder exists */
export const ensureUploadDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/* 🔥 Get safe file path */
export const getFilePath = (folder, fileName) => {
  return path.join(folder, fileName);
};