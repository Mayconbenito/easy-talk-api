import User from "../../models/User";

export class ShowUserContactsUseCase {
  async execute(data) {
    const user = await User.findById(data.userId)
    .populate("contacts")
    .select("-_id +contacts")
    .skip(data.limit * (data.page - 1))
    .limit(data.limit);

  const contacts =
    user && user.contacts && user.contacts.length > 0 ? user.contacts : [];

  contacts.map((contact) => {
    contact.contacts = undefined;
    contact.session = undefined;
    return contact;
  });

  const total = await User.countDocuments({ _id: data.userId });

  const meta = {
    total: total,
    items: contacts.length,
    pages: Math.ceil(total / data.limit),
  };

  return {
    status: 200,
    meta,
    contacts,
  };
  }
}
