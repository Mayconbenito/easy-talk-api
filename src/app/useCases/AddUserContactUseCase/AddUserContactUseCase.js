import User from "../../models/User";

export class AddUserContactUseCase {
  async execute(data) {
    const verifyFriend = await User.findById(data.id);
    if (!verifyFriend) {
      return { status: 404, code: "USER_NOT_FOUND" }
    }

    const verifyContact = await User.findOne({
      _id: data.userId,
      contacts: data.id,
    });

    if (verifyContact) {
      return { status: 400, code: "CONTACT_ALREADY_ADDED" }
    }

    const addContact = await User.findOneAndUpdate(
      { _id:data.userId },
      { $push: { contacts: data.id } }
    );

    if (addContact) {
      return { status: 204 };
    }
  }
}
