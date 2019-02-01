const router = require("express").Router();

module.exports = (mysql, io) => {
  router.post("/message/:toId", async (req, res) => {
    try {
      const { message } = req.body;
      const { toId } = req.params;

      const [session] = await mysql.query(
        "SELECT * FROM sessions WHERE user_id = ? ORDER BY id DESC LIMIT 1",
        [toId]
      );

      if (session[0].status === 1) {
        const [fromUser] = await mysql.query(
          "SELECT * FROM users WHERE id = ?",
          [req.userId]
        );

        io.to(session[0].websocket_id).emit("message", {
          message: message,
          date_time: new Date(),
          from: {
            id: fromUser[0].id,
            username: fromUser[0].username,
            picture: fromUser[0].picture
          }
        });
      }

      await mysql.query(
        "INSERT INTO messages (data, from_id, to_id, date_time) VALUES (?,?,?,?)",
        [message, req.userId, toId, new Date()]
      );

      res.json({ code: "MESSAGE_SENT" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  });

  return router;
};
