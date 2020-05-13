import Chats from "../models/chats";
import Users from "../models/users";
import Messages from "../models/messages";

import { sendMessage } from "../../utils/websocket";
import mongoose from "mongoose";

export default {
  store: async (req, res) => {
    try {
      const { _id, message } = req.body;
      const { chatId } = req.params;

      const checkMessageIdExistence = await Messages.findById(_id);

      if (checkMessageIdExistence) {
        return res.status(400).json({
          code: "ID_ALREADY_EXISTS",
        });
      }

      const chat = await Chats.findOne({
        _id: chatId,
      })
        .select("-messages")
        .lean();

      if (!chat) {
        return res.status(404).json({
          code: "CHAT_NOT_EXISTS",
        });
      }

      const [reciverId] = chat.participants.filter(
        (participant) => String(participant) !== req.user.id
      );

      const reciver = await Users.findById(reciverId).select("-contacts");

      if (!reciver) {
        return res.status(404).json({ code: "USER_NOT_FOUND" });
      }

      const messageObj = {
        _id: _id || mongoose.Types.ObjectId(),
        senderId: req.user.id,
        reciverId,
        data: message,
        status: "sent",
        type: "text",
      };

      const createdMessage = await Messages.create(messageObj);

      await Chats.updateOne(
        { _id: chat._id },
        {
          lastSentMessage: message,
          $push: { messages: createdMessage._id },
          $inc: { messagesCount: 1 },
        }
      ).select("-messages");

      sendMessage(reciver._id, {
        chat: {
          ...chat,
          messagesCount: chat.messagesCount + 1,
          lastSentMessage: messageObj.data,
          user: reciver,
        },
        message: messageObj,
      });

      return res.json({
        chat: {
          ...chat,
          messagesCount: chat.messagesCount + 1,
          lastSentMessage: messageObj.data,
          user: reciver,
        },
        message: messageObj,
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
        _id: chatId,
      })
        .select("_id messages messagesCount")
        .populate([
          {
            path: "messages",
            model: "Messages",
            options: {
              sort: {
                createdAt: -1,
              },
              skip: limit * page - limit,
              limit,
            },
          },
        ]);

      if (!chat) {
        return res.status(404).json({
          code: "CHAT_NOT_EXISTS",
        });
      }

      const meta = {
        total: chat.messagesCount,
        items: chat.messages.length,
      };

      return res.json({ meta, messages: chat.messages });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  },
};
