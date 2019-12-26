import express from "express";
import { celebrate } from "celebrate";

import SessionController from "./app/controllers/SessionController";
import ChatController from "./app/controllers/ChatController";
import MessageController from "./app/controllers/MessageController";
import ContactController from "./app/controllers/ContactController";
import SearchController from "./app/controllers/SearchController";
import UserController from "./app/controllers/UserController";

import auth from "./app/middlewares/auth";

import UserValidator from "./app/validators/User";
import SessionValidator from "./app/validators/Session";
import ContactValidator from "./app/validators/Contact";
import MessageValidator from "./app/validators/Message";
import SearchValidator from "./app/validators/Search";

const routes = express.Router();

routes.post(
  "/sessions",
  celebrate(SessionValidator.store),
  SessionController.store
);
routes.post("/register", celebrate(UserValidator.store), UserController.store);

routes.get("/chats", auth, ChatController.index);
routes.post(
  "/messages/:toId",
  auth,
  celebrate(MessageValidator.store),
  MessageController.store
);

routes.post(
  "/contacts/:id",
  auth,
  celebrate(ContactValidator.store),
  ContactController.store
);
routes.delete(
  "/contacts/:id",
  auth,
  celebrate(ContactValidator.delete),
  ContactController.delete
);
routes.get(
  "/contacts",
  auth,
  celebrate(ContactValidator.index),
  ContactController.index
);

routes.get(
  "/search/users",
  auth,
  celebrate(SearchValidator.index),
  SearchController.index
);

routes.get(
  "/users/:id",
  auth,
  celebrate(UserValidator.show),
  UserController.show
);

export default routes;
