import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import http from "http";
import { Server } from "socket.io";

import socketHandler from "./socket/socket.js";

// ROUTES
import userroutes from "./routes/auth.js";
import videoroutes from "./routes/video.js";
import likeroutes from "./routes/like.js";
import commentroutes from "./routes/comment.js";
import translateroutes from "./routes/translate.js";
import downloadRoutes from "./routes/download.js";
import premiumRoutes from "./routes/premium.js";
import historyRoutes from "./routes/history.js";
import callRoutes from "./routes/call.js";
import watchLaterRoutes from "./routes/watchLater.js";

dotenv.config();

const app = express();

// ✅ FIX 1: TRUST PROXY (VERY IMPORTANT)
app.set("trust proxy", 1);

const server = http.createServer(app);

// ✅ SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://yourtube2-0-ankq.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket
socketHandler(io);

// ✅ CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://yourtube2-0-ankq.vercel.app",
    ],
    credentials: true,
  })
);

// ✅ BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ FIX 2: STATIC FILES (SAFE PATH)
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ ROUTES
app.use("/user", userroutes);
app.use("/video", videoroutes);
app.use("/like", likeroutes);
app.use("/comment", commentroutes);
app.use("/translate", translateroutes);
app.use("/download", downloadRoutes);
app.use("/premium", premiumRoutes);
app.use("/history", historyRoutes);
app.use("/call", callRoutes);
app.use("/watchlater", watchLaterRoutes);

// ✅ ROOT
app.get("/", (req, res) => {
  res.send("YouTube backend running 🚀");
});

// ✅ MONGODB
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

// ✅ PORT
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});