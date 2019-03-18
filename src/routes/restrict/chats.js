const router = require("express").Router();

const Chats = require("../../models/chats");

module.exports = () => {
  router.get("/chats", async (req, res) => {
    try {
      const allChats = await Chats.find({ participants: req.userId })
        .populate("participants")
        .select("-messages");

      // For each chat, get the other user object and create a property called fromUser
      const chats = allChats.map(chat => {
        const [fromUser] = chat.participants.filter(
          participant => participant._id != req.userId
        );

        if (fromUser) {
          chat.participants = undefined;
          fromUser.contacts = undefined;

          return { ...chat.toObject(), fromUser: { ...fromUser.toObject() } };
        }
      });

      res.json({ chats });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  });

  return router;
};
