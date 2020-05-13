import Chat from "../models/Chat";

export default {
  store: async (req, res, next) => {
    try {
      const { participants } = req.body;

      // remove the logged user from the array
      const filtredParticipants = participants.filter(
        (item) => item !== req.user.id
      );

      const chat = await Chat.findOne({
        $or: [
          { participants: [filtredParticipants[0], req.user.id] },
          { participants: [req.user.id, filtredParticipants[0]] },
        ],
      }).select("-messages");

      if (chat) {
        return res.json({
          chat,
        });
      }

      if (!filtredParticipants.length > 0) {
        return res.status(400).json({
          code: "NOT_ENOUGH_PARTICIPANTS",
        });
      }

      const createChat = await Chat.create({
        participants: [filtredParticipants[0], req.user.id],
      });

      createChat.messages = undefined;

      return res.json({ chat: createChat });
    } catch (err) {
      return next(err)
    }
  },
  index: async (req, res, next) => {
    try {
      const allChats = await Chat.find({
        participants: req.user.id,
      })
        .populate({ path: "participants", select: "-contacts" })
        .select("-messages")
        .lean();

      // For each chat, get the other participant object and create a property called user
      const chats = allChats
        .filter((chat) => chat.messagesCount > 0)
        .map((chat) => {
          const [user] = chat.participants.filter(
            (participant) => String(participant._id) !== req.user.id
          );

          chat.participants = chat.participants.map(
            (participant) => participant._id
          );

          return { ...chat, user };
        });

      const meta = {
        items: chats.length,
      };

      return res.json({ meta, chats });
    } catch (err) {
      return next(err)
    }
  },
};
