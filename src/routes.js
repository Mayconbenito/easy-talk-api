import express from "express";
import { celebrate } from "celebrate";

import SessionController from "./app/controllers/SessionController";
import ChatController from "./app/controllers/ChatController";
import ChatMessageController from "./app/controllers/ChatMessageController";
import UserContactController from "./app/controllers/UserContactController";
import SearchController from "./app/controllers/SearchController";
import UserController from "./app/controllers/UserController";
import UserProfilePicture from "./app/controllers/UserProfilePicture";

import auth from "./app/middlewares/auth";
import uploadFile from "./app/middlewares/uploadFile";

import UserValidator from "./app/validators/User";
import SessionValidator from "./app/validators/Session";
import UserContactValidator from "./app/validators/UserContact";
import ChatValidator from "./app/validators/Chat";
import ChatMessageValidator from "./app/validators/ChatMessage";
import SearchValidator from "./app/validators/Search";

const routes = express.Router();

routes.post(
  "/sessions",
  celebrate(SessionValidator.store),
  SessionController.store
);
routes.post("/register", celebrate(UserValidator.store), UserController.store);

routes.post(
  "/chats",
  auth,
  celebrate(ChatValidator.store),
  ChatController.store
);
routes.get("/me/chats", auth, ChatController.index);
routes.get(
  "/chats/:chatId/messages",
  auth,
  celebrate(ChatMessageValidator.index),
  ChatMessageController.index
);

routes.post(
  "/chats/:chatId/messages",
  auth,
  celebrate(ChatMessageValidator.store),
  ChatMessageController.store
);

routes.get("/me", auth, UserController.show);
routes.get(
  "/me/contacts",
  auth,
  celebrate(UserContactValidator.index),
  UserContactController.index
);
routes.put("/me/profile-picture", uploadFile, auth, UserProfilePicture.put);

routes.post(
  "/contacts/:id",
  auth,
  celebrate(UserContactValidator.store),
  UserContactController.store
);
routes.delete(
  "/contacts/:id",
  auth,
  celebrate(UserContactValidator.delete),
  UserContactController.delete
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
