import User from "../models/User";

export default {
  index: async (req, res) => {
    try {
      let { page, limit } = req.query;
      limit = parseInt(limit || 10);

      const user = await User.findById(req.user.id)
        .populate("contacts")
        .select("-_id +contacts")
        .skip(limit * (page - 1))
        .limit(limit);

      const contacts =
        user && user.contacts && user.contacts.length > 0 ? user.contacts : [];

      contacts.map((contact) => {
        contact.contacts = undefined;
        contact.session = undefined;
        return contact;
      });

      const total = await User.countDocuments({ _id: req.user.id });

      const meta = {
        total: total,
        items: contacts.length,
        pages: Math.ceil(total / limit),
      };

      return res.json({
        meta,
        contacts,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  },
  store: async (req, res) => {
    try {
      const { id } = req.params;

      const verifyFriend = await User.findById(id);
      if (!verifyFriend) {
        return res.status(404).json({ code: "USER_NOT_FOUND" });
      }

      const verifyContact = await User.findOne({
        _id: req.user.id,
        contacts: id,
      });

      if (verifyContact) {
        return res.status(400).json({ code: "CONTACT_ALREADY_ADDED" });
      }

      const addContact = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $push: { contacts: id } }
      );

      if (addContact) {
        return res.status(204).send();
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const contact = await User.findById(id);
      if (!contact) {
        return res.status(404).json({ code: "USER_NOT_FOUND" });
      }

      const removeContact = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $pull: { contacts: id } }
      );

      if (removeContact) {
        return res.status(204).send();
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  },
};
