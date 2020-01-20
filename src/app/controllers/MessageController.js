import Users from "../models/users";
import Chats from "../models/chats";
import mongoose from "mongoose";

export default {
  store: async (req, res) => {
    try {
      const { message } = req.body;
      const { chatId } = req.params;

      const chat = await Chats.findOne({
        _id: chatId
      }).select("-messages");

      if (!chat) {
        return res.status(404).json({
          code: "CHAT_NOT_EXISTS"
        });
      }

      const sender = await Users.findById(req.user.id).select("-contacts");

      const [reciverId] = chat.participants.filter(
        participant => participant.toJSON() !== req.user.id
      );

      const reciver = await Users.findById(reciverId).select("-contacts");

      if (!reciver) {
        return res.status(404).json({ code: "USER_NOT_FOUND" });
      }

      const messageObj = {
        _id: mongoose.Types.ObjectId(),
        senderId: req.user.id,
        reciverId,
        data: message,
        status: "sent",
        type: "text"
      };

      await Chats.updateOne(
        { _id: chat._id },
        {
          lastSentMessage: message,
          $push: { messages: messageObj },
          $inc: { messagesCount: 1 }
        }
      ).select("-messages");

      if (reciver.session && reciver.session.status === "online") {
        req.io.to(reciver.session.socketId).emit("message", {
          chat: {
            ...chat.toJSON(),
            messagesCount: chat.messagesCount + 1,
            lastSentMessage: messageObj.data,
            sender
          },
          message,
          sender,
          timestamp: new Date()
        });
      }

      return res.json({
        chat: {
          ...chat.toJSON(),
          messagesCount: chat.messagesCount + 1,
          lastSentMessage: messageObj.data,
          sender
        },
        message: messageObj
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
};
