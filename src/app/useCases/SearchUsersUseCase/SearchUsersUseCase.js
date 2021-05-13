import User from "../../models/User";

export class SearchUsersUseCase {
  async execute(data) {
    const findUsers = await User.find({
      $or: [
        { name: { $regex: new RegExp(data.searchText, "ig") } },
        { email: data.searchText },
      ],
      _id: { $ne: data.userId },
    })
      .select("-contacts -session")
      .limit(data.limit);

    const total = await User.countDocuments({
      $or: [
        { name: { $regex: new RegExp(data.searchText, "ig") } },
        { email: data.searchText },
      ],
      _id: { $ne: data.userId },
    });

    let decrementUser = 0;

    // Verify if the logged user is on the array
    const users = findUsers.filter((user) => user._id !== data.userId);

    // If the logged user is on the array add the value 1 to decrement
    if (users.length !== findUsers.length) {
      decrementUser = 1;
    }

    const meta = {
      total: total - decrementUser,
      items: users.length,
      pages: Math.ceil(total / (data.limit - decrementUser)),
    };

    return {
      status: 200,
      meta,
      users,
    }
  }
}
