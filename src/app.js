import express from "express";
import http from "http";
import socketIo from "socket.io";
import { errors } from "celebrate";

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
    const token = socket.token;
    // When the socket connect set the socket status to active
    await Users.findOneAndUpdate(
      { ws: { token } },
      {
        ws: {
          socket: { id: socket.id, createdAt: Date.now(), status: "active" }
        }
      }
    );

    socket.on("disconnect", async () => {
      // When the socket disconnect set the socket status to unactive
      await Users.findOneAndUpdate(
        { ws: { socket: socket.id } },
        {
          ws: {
            socket: { id: socket.id, createdAt: Date.now(), status: "unactive" }
          }
        }
      );
    });
  });
};

main();

export { server, app };
