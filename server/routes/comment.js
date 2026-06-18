import express from "express";

import {
  addComment,
  getComments,
  editComment,
  deleteComment,
} from "../controllers/comment.js";

const router = express.Router();

router.post("/add", addComment);

router.get("/:videoId", getComments);

router.put("/edit/:id", editComment);

router.delete("/delete/:id", deleteComment);

export default router;