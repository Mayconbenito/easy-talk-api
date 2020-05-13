import Chat from "../models/Chat";
import User from "../models/User";
import Message from "../models/Message";

import { sendMessage } from "../../utils/websocket";
import mongoose from "mongoose";

export default {
  store: async (req, res, next) => {
    try {
      const { _id, message } = req.body;
      const { chatId } = req.params;

      const checkMessageIdExistence = await Message.findById(_id);

      if (checkMessageIdExistence) {
        return res.status(400).json({
          code: "ID_ALREADY_EXISTS",
        });
      }

      const chat = await Chat.findOne({
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

      const reciver = await User.findById(reciverId).select("-contacts");

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

      const createdMessage = await Message.create(messageObj);

      await Chat.updateOne(
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
    } catch (err) {
      return next(err)
    }
  },
  index: async (req, res, next) => {
    try {
      let { page, limit } = req.query;
      limit = parseInt(limit || 10);
      const { chatId } = req.params;

      const chat = await Chat.findOne({
        _id: chatId,
      })
        .select("_id messages messagesCount")
        .populate([
          {
            path: "messages",
            model: "Message",
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
    } catch (err) {
      return next(err)
    }
  },
};
