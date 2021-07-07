import User from "../../models/User";

export class ShowUserProfileUseCase {
  async execute(data) {
    const loggedUser = await User.findOne({ _id: data.userId });

    if (data.isMe) {
      loggedUser.contacts = undefined;
      return { status: 200, user: loggedUser };
    } else {
      const user = await User.findOne({ _id: data.id }).select("-contacts").lean();

      if (!user) {
        return { status: 404, code: "USER_NOT_FOUND" };
      }

      const isContact =
        loggedUser.contacts.length > 0
          ? !!loggedUser.contacts.find(
              (contact) => String(contact._id) === data.id
            )
          : false;

      return { status: 200, user: { ...user, isContact } };
    }
  }
}
