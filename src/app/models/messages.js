import mongoose from "../../config/mongodb";

const schema = new mongoose.Schema({
  _id: { type: mongoose.Schema.ObjectId },
  senderId: { type: mongoose.Schema.ObjectId, required: true, ref: "Users" },
  reciverId: { type: mongoose.Schema.ObjectId, required: true, ref: "Users" },
  data: { type: String, required: true },
  status: { type: String, enum: ["sent", "recived", "read"], required: true },
  type: {
    type: String,
    enum: ["text", "image", "audio", "video"],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Messages", schema);
