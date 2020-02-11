import express from "express";
import http from "http";
import socketIo from "socket.io";
import { errors } from "celebrate";

import "dotenv/config";
import ioMiddleware from "./app/middlewares/io";
import routes from "./routes";
import { setupWS } from "./utils/websocket";

const app = express();
const server = http.Server(app);
const socket = socketIo(server);

app.use(express.json());
app.use(routes);
app.use(errors());

socket.use(ioMiddleware);
setupWS(socket);

export { server, app };
