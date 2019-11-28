const { generateHash } = require("../../utils/crypto");
const jwt = require("../../utils/jwt");

const Users = require("../models/users");

module.exports = {
  store: async (req, res) => {
    try {
      const { email, password } = req.body;

      const passwordHash = await generateHash(process.env.APP_KEY, password);

      const user = await Users.findOne({
        email: email,
        password: passwordHash
      });

      if (!user) {
        return res.status(401).json({ code: "INVALID_LOGIN_DATA" });
      }

      const jwtToken = await jwt.sign({ id: user._id }, process.env.JWT_HASH);

      res.status(200).json({ jwt: jwtToken, code: "LOGIN_SUCCESS" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
};
