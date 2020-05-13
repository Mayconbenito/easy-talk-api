import express from "express";
import http from "http";
import socketIo from "socket.io";
import { errors } from "celebrate";
import * as Sentry from "@sentry/node";

import "dotenv/config";
import ioMiddleware from "./app/middlewares/io";
import errorHandler from "./app/middlewares/errorHandler"
import routes from "./routes";
import { setupWS } from "./utils/websocket";

const app = express();

Sentry.init({ dsn: process.env.SENTRY_DSN });

app.use(Sentry.Handlers.requestHandler());

const server = http.Server(app);
const socket = socketIo(server);

app.use(express.json());
app.use(routes);
app.use(errors());

socket.use(ioMiddleware);
setupWS(socket);

app.use(Sentry.Handlers.errorHandler());

app.use(errorHandler)

export { server, app };
