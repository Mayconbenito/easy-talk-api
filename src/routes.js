const routes = require("express").Router();
const { celebrate } = require("celebrate");

const SessionController = require("./app/controllers/SessionController");
const UserController = require("./app/controllers/UserController");
const ChatController = require("./app/controllers/ChatController");
const MessageController = require("./app/controllers/MessageController");
const ContactController = require("./app/controllers/ContactController");
const SearchController = require("./app/controllers/SearchController");

const auth = require("./app/middlewares/auth");
const validators = require("./app/validators");

routes.post(
  "/sessions",
  celebrate(validators.Session.store),
  SessionController.store
);
routes.post(
  "/register",
  celebrate(validators.User.store),
  UserController.store
);

routes.get("/chats", auth, ChatController.index);
routes.post(
  "/messages/:toId",
  auth,
  celebrate(validators.Message.store),
  MessageController.store
);

routes.post(
  "/contacts/:id",
  auth,
  celebrate(validators.Contact.store),
  ContactController.store
);
routes.get(
  "/contacts",
  auth,
  celebrate(validators.Contact.index),
  ContactController.index
);

routes.get(
  "/search/users",
  auth,
  celebrate(validators.Search.index),
  SearchController.index
);

module.exports = routes;
