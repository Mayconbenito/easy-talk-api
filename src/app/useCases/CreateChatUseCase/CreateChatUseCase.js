import Chat from "../../models/Chat";

export class CreateChaseUseCase {
  async execute(data) {
    // remove the logged user from the array
    const filtredParticipants = data.participants.filter(
      (item) => item !== data.userId
    );

    const chat = await Chat.findOne({
      $or: [
        { participants: [filtredParticipants[0], data.userId] },
        { participants: [data.userId, filtredParticipants[0]] },
      ],
    }).select("-messages");

    if (chat) {
      return {
        status: 200,
        chat,
      }
    }

    if (!filtredParticipants.length > 0) {
      return {
        status: 400,
        code: "NOT_ENOUGH_PARTICIPANTS",
      };
    }

    const createChat = await Chat.create({
      participants: [filtredParticipants[0], data.userId],
    });

    createChat.messages = undefined;

    return { status: 200, chat: createChat }
  }
}
