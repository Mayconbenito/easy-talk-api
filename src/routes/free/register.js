const router = require("express").Router();

const { generateHash } = require("../../utils/crypto");
const jwt = require("../../utils/jwt");
const {
  validationSchema,
  validationResult
} = require("../../middlewares/validations");

module.exports = mysql => {
  router.post("/register", validationSchema.register, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;

      const [verifyUser] = await mysql.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (verifyUser.length > 0) {
        res.status(401).json({ code: "EMAIL_IN_USE" });
        return;
      }

      const passwordHash = await generateHash(process.env.APP_KEY, password);

      const [registerUser] = await mysql.execute(
        "INSERT INTO users (username, email, password, created_at) VALUES (?,?,?,?)",
        [username, email, passwordHash, new Date()]
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
