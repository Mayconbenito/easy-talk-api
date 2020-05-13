import User from "../models/User";

export default {
  index: async (req, res, next) => {
    try {
      let { searchText, limit } = req.query;
      limit = parseInt(limit || 10);

      const findUsers = await User.find({
        $or: [
          { name: { $regex: new RegExp(searchText, "ig") } },
          { email: searchText },
        ],
        _id: { $ne: req.user.id },
      })
        .select("-contacts -session")
        .limit(limit);

      const total = await User.countDocuments({
        $or: [
          { name: { $regex: new RegExp(searchText, "ig") } },
          { email: searchText },
        ],
        _id: { $ne: req.user.id },
      });

      let decrementUser = 0;

      // Verify if the logged user is on the array
      const users = findUsers.filter((user) => user._id !== req.user.id);

      // If the logged user is on the array add the value 1 to decrement
      if (users.length !== findUsers.length) {
        decrementUser = 1;
      }

      const meta = {
        total: total - decrementUser,
        items: users.length,
        pages: Math.ceil(total / (limit - decrementUser)),
      };

      return res.json({
        meta,
        users,
      });
    } catch (err) {
      return next(err)
    }
  },
};
