const router = require("express").Router();

const {
  validationSchema,
  validationResult
} = require("../../middlewares/validations");

module.exports = mysql => {
  router.get(
    "/peoples/:searchText/:page",
    validationSchema.peoples.get,
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { searchText, page } = req.params;
        const numberItems = 10;
        const limit = numberItems * page - numberItems;

        const [selectUsers] = await mysql.query(
          `SELECT SQL_CALC_FOUND_ROWS id, username, picture FROM users WHERE email = ? OR username LIKE ? LIMIT ${limit},${numberItems}`,
          [searchText, `%${searchText}%`]
        );

        if (!selectUsers.length > 0) {
          res.json([]);
          return;
        }

        const [selectTotalItems] = await mysql.query(
          "SELECT id FROM users WHERE email = ? OR username LIKE ?",
          [searchText, `%${searchText}%`]
        );

        const totalItems = selectTotalItems.length;

        const filtredUsers = selectUsers.filter(user => user.id !== req.userId);

        let decrementValue = 0;
        if (filtredUsers.length !== selectUsers.length) {
          decrementValue = 1;
        }

        const verifyFriend = Promise.all(
          filtredUsers.map(async user => {
            const [selectFriend] = await mysql.query(
              "SELECT * FROM friends WHERE user_a = ? AND user_b = ?",
              [req.userId, user.id]
            );

            if (selectFriend.length > 0) {
              return { ...user, friend: true };
            }

            return { ...user, friend: false };
          })
        );

        const users = await verifyFriend;

        res.json({
          metadata: {
            totalItems: totalItems - decrementValue,
            items: users.length,
            pages: Math.ceil(totalItems / (numberItems - decrementValue))
          },
          users: users
        });
      } catch (e) {
        console.log(e);
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
      }
    }
  );

  return router;
};
