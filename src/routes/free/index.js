const router = require("express").Router();

module.exports = mysql => {
  router.use(require("./login")(mysql));
  router.use(require("./register")(mysql));

  return router;
};
