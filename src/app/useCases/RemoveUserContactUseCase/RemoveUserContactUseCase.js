import User from "../../models/User";

export class RemoveUserContactUseCase {
  async execute(data) {
    const contact = await User.findById(data.id);

    if (!contact) {
      return { status: 404, code: "USER_NOT_FOUND" }
    }

    const removeContact = await User.findOneAndUpdate(
      { _id: data.userId },
      { $pull: { contacts: data.id } }
    );

    if (removeContact) {
      return { status: 204 }
    }
  }
}
