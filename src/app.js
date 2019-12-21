import express from "express";
import http from "http";
import socketIo from "socket.io";
import { errors } from "celebrate";
import jwt from "./utils/jwt";
import ioMiddleware from "./app/middlewares/io";
import routes from "./routes";
import "dotenv/config";

const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.use(express.json());
app.use(routes);
app.use(errors());

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

export default app;
