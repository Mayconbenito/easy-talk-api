const router = require("express").Router();

module.exports = mysql => {
  router.get("/chats", async (req, res) => {
    try {
      const [messages] = await mysql.query(
        "SELECT to_id, from_id FROM messages WHERE to_id = ? OR from_id = ?",
        [req.userId, req.userId]
      );

      const usersId = await Promise.all(
        messages.map(chat => {
          if (chat.to_id === req.userId) {
            return chat.from_id;
          } else {
            return chat.to_id;
          }
        })
      );

      const uniqueUsersId = usersId.filter(
        (item, pos) => usersId.indexOf(item) === pos
      );

      const chatQuery =
        "SELECT id, data AS message, date_time FROM messages WHERE to_id = ? AND from_id = ? ORDER BY id DESC LIMIT 1";

      const chats = await Promise.all(
        uniqueUsersId.map(async profile => {
          let [[chat]] = await mysql.query(chatQuery, [profile, req.userId]);
          let [[chatUser]] = await mysql.query(
            "SELECT id, username, picture FROM users WHERE id = ?",
            [profile]
          );

          if (!chat || chat.to_id === profile) {
            [[chat]] = await mysql.query(chatQuery, [req.userId, profile]);
          }

          delete chat.id;

          return { ...chat, user: chatUser };
        })
      );

      res.json({ chats });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  });

  return router;
};
