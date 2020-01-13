import Users from "../models/users";
import Chats from "../models/chats";
import mongoose from "mongoose";

export default {
  store: async (req, res) => {
    try {
      const { message } = req.body;
      const { reciverId } = req.params;

      const reciver = await Users.findById(reciverId);

      if (!reciver) {
        return res.status(404).json({ code: "USER_NOT_FOUND" });
      }

      const senderUser = await Users.findById(req.user.id).select("-contacts");

      const chat = await Chats.findOne({
        $or: [
          { participants: [reciverId, req.user.id] },
          { participants: [req.user.id, reciverId] }
        ]
      }).select("_id");

      const messageObj = {
        _id: mongoose.Types.ObjectId(),
        senderId: req.user.id,
        reciverId,
        data: message,
        status: "sent",
        type: "text"
      };

      if (!chat) {
        // Create chat and add the message
        const chat = await Chats.create({
          participants: [reciverId, req.user.id],
          lastSentMessage: message,
          messages: messageObj
        });

        if (reciver.session && reciver.session.status === "online") {
          req.io.to(reciver.session.socketId).emit("message", {
            chat: { participants: chat.participants, _id: chat._id },
            message,
            sender: senderUser,
            timestamp: new Date()
          });
        }

        chat.messages = undefined;

        return res.json({
          chat: { ...chat.toJSON(), sender: senderUser },
          message: messageObj
        });
      } else {
        // Add the message to the chat if the chat already exists
        const updatedChat = await Chats.findOneAndUpdate(
          { _id: chat._id },
          { lastSentMessage: message, $push: { messages: messageObj } }
        ).select("-messages");

        if (reciver.session && reciver.session.status === "online") {
          req.io.to(reciver.session.socketId).emit("message", {
            chat: updatedChat,
            message,
            sender: senderUser,
            timestamp: new Date()
          });
        }

        return res.json({
          chat: { ...updatedChat.toJSON(), sender: senderUser },
          message: messageObj
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
};
