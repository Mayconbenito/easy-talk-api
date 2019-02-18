const router = require("express").Router();

const {
  validationSchema,
  validationResult
} = require("../../middlewares/validations");

module.exports = (mysql, io) => {
  router.post(
    "/messages/:toId",
    validationSchema.messages.post,
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { message } = req.body;
        const { toId } = req.params;

        const [verifyReciver] = await mysql.query(
          "SELECT id FROM users WHERE id = ?",
          [toId]
        );

        if (!verifyReciver.length > 0) {
          res.json({ code: "USER_NOT_FOUND" });
          return;
        }

        const [session] = await mysql.query(
          "SELECT * FROM sessions WHERE user_id = ? ORDER BY id DESC LIMIT 1",
          [toId]
        );

        const [fromUser] = await mysql.query(
          "SELECT * FROM users WHERE id = ?",
          [req.userId]
        );

        io.to(session[0].socket_id).emit("message", {
          message: message,
          date_time: new Date(),
          from: {
            id: fromUser[0].id,
            username: fromUser[0].username,
            picture: fromUser[0].picture
          }
        });

        await mysql.query(
          "INSERT INTO messages (data, from_id, to_id, date_time) VALUES (?,?,?,?)",
          [message, req.userId, toId, new Date()]
        );

        res.json({ code: "MESSAGE_SENT" });
      } catch (e) {
        console.log(e);
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
      }
    }
  );

  return router;
};
