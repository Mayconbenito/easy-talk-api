import mongoose from "mongoose";
import { sendMessage } from "../../../websocket";
import Chat from "../../models/Chat";
import Message from "../../models/Message";
import User from "../../models/User";

export class SendChatMessageUseCase {
  async execute(data) {
    const checkMessageIdExistence = await Message.findById(data.messageId);

      if (checkMessageIdExistence) {
        return {
          status: 400,
          code: "ID_ALREADY_EXISTS",
        };
      }

      const chat = await Chat.findOne({
        _id: data.chatId,
      })
        .select("-messages")
        .lean();

      if (!chat) {
        return {
          status: 404,
          code: "CHAT_NOT_EXISTS",
        }
      }

      const [reciverId] = chat.participants.filter(
        (participant) => String(participant) !== data.userId
      );

      const reciver = await User.findById(reciverId).select("-contacts");

      if (!reciver) {
        return{ status: 404, code: "USER_NOT_FOUND" }
      }

      const messageObj = {
        _id: data.messageId || mongoose.Types.ObjectId(),
        senderId: data.userId,
        reciverId,
        data: data.message,
        status: "sent",
        type: "text",
      };

      const createdMessage = await Message.create(messageObj);

      await Chat.updateOne(
        { _id: chat._id },
        {
          lastSentMessage: data.message,
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

      return {
        status: 200,
        chat: {
          ...chat,
          messagesCount: chat.messagesCount + 1,
          lastSentMessage: messageObj.data,
          user: reciver,
        },
        message: messageObj,
      }
  }
}
