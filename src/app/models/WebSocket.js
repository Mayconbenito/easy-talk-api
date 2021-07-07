import mongoose from "mongoose";

const schema = new mongoose.Schema({
  token: { type: String, required: true },
  socketId: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true },
  status: { type: String, required: true, default: "active" },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("WebSocket", schema, "websocket_sessions");
