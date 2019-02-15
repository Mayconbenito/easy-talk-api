const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const jwt = require("./utils/jwt");
require("dotenv").config();

app.use(express.json());

const main = async () => {
  const mysql = require("mysql2");
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

  const connection = pool.promise();

  app.use("/", require("./routes/free")(connection));
  app.use("/app", require("./routes/restrict")(connection, io));

  io.on("connection", async socket => {
    const jwtKey = socket.handshake.query.jwt;

    const jwtDecoded = await jwt.verify(jwtKey, process.env.JWT_HASH);
    await connection.query(
      "INSERT INTO sessions (status, socket_id, started_at, user_id) VALUES (?,?,?,?)",
      [1, socket.id, new Date(), jwtDecoded.id]
    );

    socket.on("disconnect", async () => {
      await connection.query(
        "UPDATE sessions SET status = '0' WHERE socket_id = ?",
        [socket.id]
      );
    });
  });
};

main();

server.listen(process.env.PORT, () => {
  console.log("Server running");
});
