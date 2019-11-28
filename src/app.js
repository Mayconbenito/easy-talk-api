const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const jwt = require("./utils/jwt");
const ioMiddleware = require("./app/middlewares/io");
require("dotenv").config();
const routes = require("./routes");

app.use(express.json());
app.use(routes);

const main = async () => {
  const Users = require("./app/models/users");

  app.use((req, res, next) => {
    req.io = io;
    return next();
  });

  io.use(ioMiddleware);

  io.on("connection", async socket => {
    const token = socket.handshake.query.jwt;

    const { id: userId } = await jwt.verify(token, process.env.JWT_HASH);
    // When the socket connect set the user status to online
    await Users.findOneAndUpdate(
      { _id: userId },
      { session: { socketId: socket.id, status: "online" } }
    );

    socket.on("disconnect", async () => {
      // When the socket disconnect set the user status to offline
      await Users.findOneAndUpdate(
        { _id: userId },
        { session: { socketId: socket.id, status: "offline" } }
      );
    });
  });
};

main();

module.exports = app;
