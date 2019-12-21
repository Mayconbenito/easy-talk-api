import generateHash from "../../utils/crypto";
import jwt from "../../utils/jwt";

import Users from "../models/users";

export default {
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

      res.json({ user, jwt: jwtToken });
    } catch (e) {
      console.log("Error", e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
};