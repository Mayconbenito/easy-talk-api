const router = require("express").Router();

const {
  validationSchema,
  validationResult
} = require("../../middlewares/validations");

const Users = require("../../models/users");

module.exports = () => {
  router.get(
    "/contacts/:page",
    validationSchema.contacts.get,
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { page } = req.params;
        const numberItems = 10;

        const { contacts } = await Users.findById(req.userId)
          .populate("contacts")
          .select("-_id +contacts")
          .skip(numberItems * (page - 1))
          .limit(numberItems);

        contacts.map(contact => {
          contact.contacts = undefined;
          contact.session = undefined;
          return contact;
        });

        const totalItems = await Users.countDocuments({ _id: req.userId });

        if (!contacts.length > 0) {
          return res.status(200).json([]);
        }

        res.json({
          metadata: {
            totalItems: totalItems,
            items: contacts.length,
            pages: Math.ceil(totalItems / numberItems)
          },
          users: contacts
        });
      } catch (e) {
        console.log(e);
        res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
      }
    }
  );

  router.post("/contacts", validationSchema.contacts.post, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.body;

      const verifyFriend = await Users.findById(id);
      if (!verifyFriend) {
        return res.status(200).json({ code: "USER_NOT_FOUND" });
      }

      const verifyContact = await Users.findOne({
        _id: req.userId,
        contacts: id
      });

      if (verifyContact) {
        return res.status(200).json({ code: "CONTACT_ALREADY_ADDED" });
      }

      const addContact = await Users.findOneAndUpdate(
        { _id: req.userId },
        { $push: { contacts: id } }
      );

      if (addContact) {
        return res.status(200).json({ code: "CONTACT_ADDED" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  });

  return router;
};
