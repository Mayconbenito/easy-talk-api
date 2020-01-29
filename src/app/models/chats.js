import mongoose from "../../config/mongodb";

const schema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Users" }
  ],
  messagesCount: { type: Number, default: 0 },
  lastSentMessage: { type: String },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Chats", schema);
