import { Joi } from "celebrate";

export default {
  store: {
    body: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    })
  }
};
