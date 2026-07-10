import express from "express";

import {
  addHistory,
  getHistory,
  deleteHistory,
  clearHistory,
} from "../controllers/history.js";

const router = express.Router();

// Save history
router.post("/", addHistory);

// Get user history
router.get("/:userId", getHistory);

// Delete one history item
router.delete("/:id", deleteHistory);

// Clear all history
router.delete("/clear/:userId", clearHistory);

export default router;