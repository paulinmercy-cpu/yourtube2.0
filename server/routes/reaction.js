import express from "express";
import { handleReaction } from "../controllers/reaction.js";

const router = express.Router();

router.post("/react/:videoId", handleReaction);

export default router;