import { Joi } from "celebrate";
import joiObjectId from "joi-objectid";

Joi.objectId = joiObjectId(Joi);

export default {
  show: {
    params: {
      id: Joi.objectId().required(),
    },
  },
  store: {
    body: Joi.object().keys({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
};
