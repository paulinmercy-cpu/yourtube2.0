import express from "express";
import {
  login,
  updateprofile,
  getUser,
} from "../controllers/auth.js";
import { verifyOTP } from "../controllers/verifyOTP.js";

const routes = express.Router();

routes.post("/login", login);
routes.post("/verify-otp", verifyOTP);

routes.patch("/update/:id", updateprofile);
routes.get("/:id", getUser);

export default routes;