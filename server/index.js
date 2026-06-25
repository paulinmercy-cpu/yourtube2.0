import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";

// ROUTES
import userroutes from "./routes/auth.js";
import videoroutes from "./routes/video.js";
import likeroutes from "./routes/like.js";
import commentroutes from "./routes/comment.js";
import translateroutes from "./routes/translate.js";
import downloadRoutes from "./routes/download.js";

dotenv.config();

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// STATIC FILES (for video playback)
app.use("/uploads", express.static(path.resolve("uploads")));

// ROUTES
app.use("/user", userroutes);
app.use("/video", videoroutes);
app.use("/like", likeroutes);
app.use("/comment", commentroutes);
app.use("/translate", translateroutes);
app.use("/download", downloadRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("YouTube backend running 🚀");
});

// MONGODB CONNECT
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("DB Error:", err));

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});