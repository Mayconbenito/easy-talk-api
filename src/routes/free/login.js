const router = require("express").Router();

const { generateHash } = require("../../utils/crypto");
const jwt = require("../../utils/jwt");
const {
  validationSchema,
  validationResult
} = require("../../middlewares/validations");

module.exports = mysql => {
  router.post("/login", validationSchema.login, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

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

  return router;
};
