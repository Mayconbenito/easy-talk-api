const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

const main = async () => {
  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

  const router = require("./router")(connection);
  app.use("/", router);
};

app.listen(3000, () => {
  console.log("Server running");
  main();
});
