const router = require("express").Router();

const {
  validationSchema,
  validationResult
} = require("../../middlewares/validations");

const Users = require("../../models/users");

module.exports = mysql => {
  router.get(
    "/contacts/:page",
    validationSchema.contacts.get,
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { page } = req.params;
        const numberItems = 10;

        const { contacts } = await Users.findById(req.userId)
          .populate("contacts")
          .select("-_id +contacts")
          .skip(numberItems * (page - 1))
          .limit(numberItems);

        const totalItems = await Users.countDocuments({ _id: req.userId });

        if (!contacts.length > 0) {
          return res.status(200).json([]);
        }

        res.json({
          metadata: {
            totalItems: totalItems,
            items: contacts.length,
            pages: Math.ceil(totalItems / numberItems)
          },
          users: contacts
        });
      } catch (e) {
        console.log(e);
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
      }
    }
  );

  router.post("/contacts", validationSchema.contacts.post, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.body;

      const [verifyUser] = await mysql.query(
        "SELECT id FROM users WHERE id = ?",
        [id]
      );

      if (!verifyUser.length > 0) {
        res.status(200).json({ code: "USER_NOT_FOUND" });
        return;
      }

      const [verifyFriend] = await mysql.query(
        "SELECT * FROM friends WHERE user_a = ? AND user_b = ?",
        [req.userId, id]
      );

      if (verifyFriend.length > 0) {
        res.status(200).json({ code: "CONTACT_ALREADY_ADDED" });
        return;
      }

      const [addUser] = await mysql.query(
        "INSERT INTO friends (user_a, user_b, date_time) VALUES (?,?,?)",
        [req.userId, id, new Date()]
      );

      if (addUser.affectedRows === 1) {
        res.status(200).json({ code: "CONTACT_ADDED" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  });

  return router;
};
