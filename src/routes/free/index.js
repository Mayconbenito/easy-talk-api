const router = require("express").Router();

module.exports = () => {
  router.use(require("./login")());
  router.use(require("./register")());

  return router;
};
