import express from "express";
import {
  handlelike,
  getalllikedVideo,
} from "../controllers/like.js";

const routes = express.Router();

routes.post("/like/:videoId", handlelike);
routes.get("/liked/:userId", getalllikedVideo);

export default routes;