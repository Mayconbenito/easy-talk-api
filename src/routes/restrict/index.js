const router = require("express").Router();
const authMiddleware = require("../../middlewares/auth");

router.use(authMiddleware);

module.exports = (mysql, io) => {
  router.use(require("./chats")(mysql));
  router.use(require("./contacts")(mysql));
  router.use(require("./message")(mysql, io));
  router.use(require("./peoples.js")(mysql));

  return router;
};
