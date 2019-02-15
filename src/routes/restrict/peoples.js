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

        let [users] = await mysql.query(
          `SELECT SQL_CALC_FOUND_ROWS id, username, picture FROM users WHERE email = ? OR username LIKE ? LIMIT ${limit},${numberItems}`,
          [searchText, `%${searchText}%`]
        );

        const [totalItems] = await mysql.query("SELECT FOUND_ROWS() as count");

        if (users.length > 0) {
          const filtredUsers = users.filter(user => user.id !== req.userId);

          res.json({
            metadata: {
              totalItems: totalItems[0].count - 1,
              items: filtredUsers.length,
              pages: Math.ceil(totalItems[0].count / numberItems - 1)
            },
            users: filtredUsers
          });
        } else {
          res.status(200).json([]);
        }
      } catch (e) {
        console.log(e);
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
      }
    }
  );

  return router;
};
