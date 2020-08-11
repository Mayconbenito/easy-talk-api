import { check, validationResult } from "express-validator/check";

const validationSchema = {
  login: [
    check("email", "invalid email address").isEmail(),
    check(
      "password",
      "password must contain between 6 and 60 characters"
    ).isLength({ min: 6, max: 60 }),
  ],
  register: [
    check(
      "username",
      "username most contain between 1 and 10 characters"
    ).isLength({ min: 1, max: 10 }),
    check("email", "invalid email address").isEmail(),
    check(
      "password",
      "password must contain between 6 and 60 characters"
    ).isLength({
      min: 6,
      max: 60,
    }),
  ],
  messages: {
    post: [check("toId").isString(), check("message").isString()],
  },
  peoples: {
    get: [check("page").isInt(), check("searchText").isString()],
  },
  contacts: {
    get: [check("page").isInt()],
    post: [check("id").isString()],
  },
};

export default { validationSchema, validationResult };
