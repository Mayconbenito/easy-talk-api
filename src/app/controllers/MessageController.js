import Users from "../models/users";
import Chats from "../models/chats";
import mongoose from "mongoose";

export default {
  store: async (req, res) => {
    try {
      const { message } = req.body;
      const { toId } = req.params;

      const verifyReciver = await Users.findById(toId);

      if (!verifyReciver) {
        return res.status(404).json({ code: "USER_NOT_FOUND" });
      }

      const fromUser = await Users.findById(req.user.id);

      if (verifyReciver.session && verifyReciver.session.status === "online") {
        req.io.to(verifyReciver.session.socketId).emit("message", {
          message: message,
          dateTime: new Date(),
          from: {
            id: fromUser._id,
            username: fromUser.name
          }
        });
      }

      const verifyChat = await Chats.findOne({
        $or: [
          { participants: [toId, req.user.id] },
          { participants: [req.user.id, toId] }
        ]
      }).select("_id");

      // Verify if the chats exists
      if (!verifyChat) {
        // Create a chat if not exists and add the message
        const messages = {
          _id: mongoose.Types.ObjectId(),
          sender: req.user.id,
          reciver: toId,
          data: message,
          status: "sent",
          type: "text"
        };

        const chat = await Chats.create({
          participants: [toId, req.user.id],
          newestMessage: message,
          messages
        });

        return res.json({
          chat: { _id: chat._id, participants: chat.participants },
          message: messages
        });
      } else {
        // Add the message to the chat if the chat exists
        const messages = {
          _id: mongoose.Types.ObjectId(),
          sender: req.user.id,
          reciver: toId,
          data: message,
          status: "sent",
          type: "text"
        };

        const chat = await Chats.findOneAndUpdate(
          { _id: verifyChat._id },
          { newestMessage: message, $push: { messages: messages } }
        ).select("_id participants");

        return res.json({
          chat,
          message: messages
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
};
