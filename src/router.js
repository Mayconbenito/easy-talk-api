const express = require("express");
const router = express.Router();

module.exports = mysql => {
  router.get("/", (req, res) => {
    res.json({ message: "Hello World" });
  });

  return router;
};
