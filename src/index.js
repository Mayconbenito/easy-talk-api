const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const jwt = require("./utils/jwt");
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

  io.on("connection", async socket => {
    const jwtKey = socket.handshake.query.jwt;

    const jwtDecoded = await jwt.verify(jwtKey, process.env.JWT_HASH);
    await connection.query(
      "INSERT INTO sessions (device, status, websocket_id, started_at, user_id) VALUES (?,?,?,?,?)",
      ["BROWSER", 1, socket.id, new Date(), jwtDecoded.id]
    );

    socket.on("disconnect", async () => {
      console.log("Got disconnect!");

      await connection.query(
        "UPDATE sessions SET status = '0' WHERE websocket_id = ?",
        [socket.id]
      );
    });
  });

  const authenticatedRouter = require("./authenticatedRouter")(connection, io);
  app.use("/app", authenticatedRouter);
};

main();

server.listen(process.env.SERVER_PORT, () => {
  console.log("Server running");
});
