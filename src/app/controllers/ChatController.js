import Chats from "../models/chats";

export default {
  index: async (req, res) => {
    try {
      const allChats = await Chats.find({ participants: req.user.id })
        .populate("participants")
        .select("-messages");

      // For each chat, get the other user object and create a property called sender
      const chats = allChats.map(chat => {
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
