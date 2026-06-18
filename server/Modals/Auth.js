import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: String,
  channelname: String,
  description: String,
  image: String,
  joinedon: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("user", userschema);