import express from "express";
import { translateText } from "../controllers/translate.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Translate Route Working");
});

router.post("/", translateText);

export default router;