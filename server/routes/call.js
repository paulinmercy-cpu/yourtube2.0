import express from "express";
import { createCall, joinCall } from "../controllers/call.js";

const router = express.Router();

router.post("/create", createCall);
router.get("/join/:roomId", joinCall);

export default router;