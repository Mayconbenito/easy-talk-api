const routes = require("express").Router();

const SessionController = require("./app/controllers/SessionController");
const UserController = require("./app/controllers/UserController");
const ChatController = require("./app/controllers/ChatController");
const MessageController = require("./app/controllers/MessageController");
const ContactController = require("./app/controllers/ContactController");
const SearchController = require("./app/controllers/SearchController");

const { validationSchema } = require("./app/middlewares/validations");
const auth = require("./app/middlewares/auth");

routes.post("/sessions", validationSchema.login, SessionController.store);
routes.post("/register", validationSchema.register, UserController.store);

routes.get("/chats", auth, ChatController.index);
routes.post(
  "/messages/:toId",
  auth,
  validationSchema.messages.post,
  MessageController.store
);

routes.post(
  "/contacts/:id",
  auth,
  validationSchema.contacts.post,
  ContactController.store
);
routes.get(
  "/contacts",
  auth,
  validationSchema.contacts.get,
  ContactController.index
);

routes.get(
  "/search/users",
  auth,
  validationSchema.peoples.get,
  SearchController.index
);
module.exports = routes;
