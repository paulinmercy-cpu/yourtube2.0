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

app.set("trust proxy", 1);

// --------------------
// Allowed Origins
// --------------------
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

// --------------------
// HTTP + Socket.IO
// --------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketHandler(io);

// --------------------
// CORS
// --------------------
app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman/server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// --------------------
// Body Parser
// --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// Static Uploads
// --------------------
const __dirname = path.resolve();

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// --------------------
// API Routes
// --------------------
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

// --------------------
// Root Route
// --------------------
app.get("/", (req, res) => {
  res.send("YouTube Backend Running 🚀");
});

// --------------------
// MongoDB
// --------------------
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
  });

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});