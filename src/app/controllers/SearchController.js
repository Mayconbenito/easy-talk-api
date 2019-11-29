const Users = require("../models/users");

module.exports = {
  index: async (req, res) => {
    try {
      const { searchText, page } = req.query;
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

      let decrementUser = 0;

      // Verify if the logged user is on the array
      const users = findUsers.filter(user => user._id !== req.userId);

      // If the logged user is on the array add the value 1 to decrement
      if (users.length !== findUsers.length) {
        decrementUser = 1;
      }

      const metadata = {
        totalItems: totalItems - decrementUser,
        items: users.length,
        pages: Math.ceil(totalItems / (numberItems - decrementUser))
      };

      return res.json({
        metadata,
        users
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
};
