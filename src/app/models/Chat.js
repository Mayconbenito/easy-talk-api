import mongoose from "mongoose";

const schema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  ],
  messagesCount: { type: Number, default: 0 },
  lastSentMessage: { type: String },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", schema, "chats");
