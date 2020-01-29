import Chats from "../models/chats";
import Users from "../models/users";
import Messages from "../models/messages";

import { sendMessage } from "../../utils/websocket";
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

      const createdMessage = await Messages.create(messageObj);

      await Chats.updateOne(
        { _id: chat._id },
        {
          lastSentMessage: message,
          $push: { messages: createdMessage._id },
          $inc: { messagesCount: 1 }
        }
      ).select("-messages");

      sendMessage(reciver._id, {
        chat: {
          ...chat.toJSON(),
          messagesCount: chat.messagesCount + 1,
          lastSentMessage: messageObj.data,
          sender
        },
        message: messageObj
      });

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
  },
  index: async (req, res) => {
    try {
      let { page, limit } = req.query;
      limit = parseInt(limit || 10);
      const { chatId } = req.params;

      const chat = await Chats.findOne({
        _id: chatId
      })
        .select("_id messages messagesCount")
        .populate([
          {
            path: "messages",
            model: "Messages",
            options: {
              sort: {},
              skip: limit * page - limit,
              limit
            }
          }
        ]);

      if (!chat) {
        return res.status(404).json({
          code: "CHAT_NOT_EXISTS"
        });
      }

      const meta = {
        total: chat.messagesCount,
        items: chat.messages.length
      };

      return res.json({ meta, messages: chat.messages });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
};
