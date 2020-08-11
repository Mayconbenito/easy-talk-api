import mongoose from "mongoose";

const schema = new mongoose.Schema({
  _id: { type: mongoose.Schema.ObjectId },
  senderId: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
  reciverId: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
  data: { type: String, required: true },
  status: { type: String, enum: ["sent", "recived", "read"], required: true },
  type: {
    type: String,
    enum: ["text", "image", "audio", "video"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", schema, "messages");
