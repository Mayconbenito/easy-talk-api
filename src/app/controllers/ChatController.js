import Chats from "../models/chats";

export default {
  store: async (req, res) => {
    try {
      const { participants } = req.body;

      const chat = await Chats.findOne({
        $or: [
          { participants: [participants[0], req.user.id] },
          { participants: [req.user.id, participants[0]] }
        ]
      }).select("-messages");

      if (chat) {
        return res.json({
          chat
        });
      }

      const createdChat = await Chats.create({
        participants: [participants[0], req.user.id]
      });

      createdChat.messages = undefined;

      return res.json({ chat: createdChat });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  },
  index: async (req, res) => {
    try {
      const allChats = await Chats.find({ participants: req.user.id })
        .populate("participants")
        .select("-messages");

      // For each chat, get the other user object and create a property called sender
      const chats = allChats
        .filter(chat => chat.messagesCount > 0)
        .map(chat => {
          const [sender] = chat.participants.filter(
            participant => participant._id !== req.user.id
          );

          chat.participants = chat.participants.map(
            participant => participant._id
          );
          sender.contacts = undefined;

          return { ...chat.toJSON(), sender };
        });

      const meta = {
        items: chats.length
      };

      return res.json({ meta, chats });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
};
