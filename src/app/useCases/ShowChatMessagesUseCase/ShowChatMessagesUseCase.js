import Chat from "../../models/Chat";

export class ShowChatMessagesUseCase {
  async execute(data) {
    const chat = await Chat.findOne({
      _id: data.chatId,
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
            skip: data.limit * data.page - data.limit,
            limit: data.limit,
          },
        },
      ]);

    if (!chat) {
      return {
        status: 404,
        code: "CHAT_NOT_EXISTS",
      }
    }

    const meta = {
      total: chat.messagesCount,
      items: chat.messages.length,
    };

    return { status: 200, meta, messages: chat.messages }
  }
}
