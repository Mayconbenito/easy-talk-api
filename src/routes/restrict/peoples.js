const router = require("express").Router();

const {
  validationSchema,
  validationResult
} = require("../../middlewares/validations");

const Users = require("../../models/users");

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

        const findUsers = await Users.find({
          $or: [
            { name: { $regex: new RegExp(searchText, "ig") } },
            { email: searchText }
          ]
        })
          .select("-contacts -session")
          .skip(numberItems * (page - 1))
          .limit(numberItems);

        const totalItems = await Users.countDocuments({
          $or: [
            { name: { $regex: new RegExp(searchText, "ig") } },
            { email: searchText }
          ]
        });

        if (!findUsers.length > 0) {
          return res.json([]);
        }

        let decrementUser = 0;

        // Verify if the logged user is on the array
        const users = findUsers.filter(user => user._id !== req.userId);

        // If the logged user is on the array add the value 1 to decrement
        if (users.length !== findUsers.length) {
          decrementUser = 1;
        }

        return res.json({
          metadata: {
            totalItems: totalItems - decrementUser,
            items: users.length,
            pages: Math.ceil(totalItems / (numberItems - decrementUser))
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
