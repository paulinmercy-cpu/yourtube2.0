import express from "express";
import { upgradePlan } from "../controllers/premium.js";

console.log("✅ Premium routes loaded");

const router = express.Router();

router.put("/upgrade", upgradePlan);

export default router;