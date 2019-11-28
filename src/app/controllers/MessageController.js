const { validationResult } = require("../middlewares/validations");

const Users = require("../models/users");
const Chats = require("../models/chats");

module.exports = {
  store: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { message } = req.body;
      const { toId } = req.params;

      const verifyReciver = await Users.findById(toId);

      if (!verifyReciver) {
        return res.json({ code: "USER_NOT_FOUND" });
      }

      const fromUser = await Users.findById(req.userId);

      if (verifyReciver.session && verifyReciver.session.status === "online") {
        req.io.to(verifyReciver.session.socketId).emit("message", {
          message: message,
          dateTime: new Date(),
          from: {
            id: fromUser._id,
            username: fromUser.name
          }
        });
      }

      const verifyChat = await Chats.findOne({
        $or: [
          { participants: [toId, req.userId] },
          { participants: [req.userId, toId] }
        ]
      });

      // Verify if the chats exists
      if (!verifyChat) {
        // Create a chat if not exists and add the message
        await Chats.create({
          participants: [toId, req.userId],
          newestMessage: message,
          messages: {
            sender: req.userId,
            reciver: toId,
            data: message,
            status: "sent",
            type: "text"
          }
        });
      } else {
        // Add the message to the chat if the chat exists
        const messages = {
          sender: req.userId,
          reciver: toId,
          data: message,
          status: "sent",
          type: "text"
        };

        await Chats.findOneAndUpdate(
          { _id: verifyChat._id },
          { newestMessage: message, $push: { messages: messages } }
        );
      }

      return res.json({ code: "MESSAGE_SENT" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
};
