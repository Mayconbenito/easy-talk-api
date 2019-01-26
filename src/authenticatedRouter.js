const express = require("express");
const router = express.Router();
require("dotenv").config();

module.exports = mysql => {
  router.get("/peoples/:searchText/:page", async (req, res) => {
    try {
      const { searchText, page } = req.params;
      const numberItems = 10;
      const limit = numberItems * page - numberItems;

      const [users] = await mysql.query(
        `SELECT id, username, picture FROM users WHERE email = ? OR username LIKE ? LIMIT ${limit},${numberItems}`,
        [searchText, `%${searchText}%`]
      );

      const [totalItems] = await mysql.query("SELECT FOUND_ROWS() as count");

      if (users.length > 0) {
        res.json({
          metadata: {
            totalItems: totalItems[0].count,
            items: users.length,
            pages: Math.ceil(page / totalItems[0].count)
          },
          users: users
        });
      } else {
        res.status(200).json([]);
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  });

  return router;
};
