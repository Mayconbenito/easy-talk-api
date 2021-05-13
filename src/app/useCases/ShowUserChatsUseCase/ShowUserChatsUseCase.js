import Chat from "../../models/Chat";

export class ShowUserChatsUseCase {
  async execute(data) {
    const allChats = await Chat.find({
      participants: data.userId,
    })
      .populate({ path: "participants", select: "-contacts" })
      .select("-messages")
      .lean();

    // For each chat, get the other participant object and create a property called user
    const chats = allChats
      .filter((chat) => chat.messagesCount > 0)
      .map((chat) => {
        const [user] = chat.participants.filter(
          (participant) => String(participant._id) !== data.userId
        );

        chat.participants = chat.participants.map(
          (participant) => participant._id
        );

        return { ...chat, user };
      });

    const meta = {
      items: chats.length,
    };

    return { status: 200, meta, chats }
  }
}
