import express from "express";

import {
  addComment,
  getComments,
  editComment,
  deleteComment,
  likeComment,
  dislikeComment,
} from "../controllers/comment.js";

const router = express.Router();

// Add Comment
router.post("/add", addComment);

// Get Comments by Video
router.get("/:videoId", getComments);

// Edit Comment
router.put("/edit/:id", editComment);

// Like Comment
router.put("/like/:id", likeComment);

// Dislike Comment
router.put("/dislike/:id", dislikeComment);

// Delete Comment
router.delete("/delete/:id", deleteComment);

export default router;