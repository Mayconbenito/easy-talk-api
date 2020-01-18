import generateHash from "../../utils/crypto";
import jwt from "../../utils/jwt";

import Users from "../models/users";

export default {
  show: async (req, res) => {
    try {
      const { id } = req.params;

      const loggedUser = await Users.findOne({ _id: req.user.id });

      if (req.path.split("/")[1] === "me") {
        loggedUser.contacts = undefined;
        return res.json({ user: loggedUser });
      } else {
        const user = await Users.findOne({ _id: id }).select("-contacts");

        if (!user) {
          return res.status(404).json({ code: "USER_NOT_FOUND" });
        }

        const isContact =
          loggedUser.contacts.length > 0
            ? !!loggedUser.contacts.find(contact => String(contact._id) === id)
            : false;

        return res.json({ user: { ...user.toJSON() }, isContact });
      }
    } catch (e) {
      console.log("Error", e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  },
  store: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const findUser = await Users.findOne({ email });

      if (findUser) {
        return res.status(400).json({ code: "EMAIL_ALREADY_USED" });
      }

      const passwordHash = await generateHash(process.env.APP_KEY, password);

      const user = await Users.create({
        name: username,
        email: email,
        password: passwordHash
      });

      user.contacts = undefined;
      user.password = undefined;

      const jwtToken = await jwt.sign({ id: user._id }, process.env.JWT_HASH);

      return res.json({ user, jwt: jwtToken });
    } catch (e) {
      console.log("Error", e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
};
