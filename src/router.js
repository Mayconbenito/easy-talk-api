const express = require("express");
const router = express.Router();

const { generateHash } = require("./utils/crypto");
const jwt = require("./utils/jwt");
require("dotenv").config();

module.exports = mysql => {
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const passwordHash = await generateHash(process.env.APP_KEY, password);
      const [login] = await mysql.execute(
        "SELECT id FROM users WHERE email = ? AND password = ?",
        [email, passwordHash]
      );

      if (login.length === 0) {
        res.status(401).json({ code: "INVALID_LOGIN_DATA" });
        return;
      }

      const jwtToken = await jwt.sign(
        { id: login[0].id },
        process.env.JWT_HASH
      );

      res.status(200).json({ jwt: jwtToken, code: "LOGIN_SUCCESS" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  });

  router.post("/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const [verifyUser] = await mysql.execute(
        "SELECT id FROM user WHERE email = ?",
        [email]
      );

      if (verifyUser.length > 0) {
        res.status(401).json({ code: "EMAIL_IN_USE" });
        return;
      }

      const passwordHash = await generateHash(process.env.APP_KEY, password);

      const [registerUser] = await mysql.execute(
        "INSERT INTO user (username, email, password) VALUES (?,?,?)",
        [username, email, passwordHash]
      );

      const jwtToken = await jwt.sign(
        { id: registerUser.insertId },
        process.env.JWT_HASH
      );

      res.status(200).json({ jwt: jwtToken, code: "REGISTER_SUCCESS" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
    }
  });

  return router;
};
