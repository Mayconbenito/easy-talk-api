const router = require("express").Router();
const authMiddleware = require("../../middlewares/auth");

router.use(authMiddleware);

module.exports = io => {
  router.use(require("./chats")());
  router.use(require("./contacts")());
  router.use(require("./messages")(io));
  router.use(require("./peoples.js")());

  return router;
};
