import { Joi } from "celebrate";
import joiObjectId from "joi-objectid";

Joi.objectId = joiObjectId(Joi);

export default {
  index: {
    params: Joi.object().keys({
      chatId: Joi.objectId().required()
    }),
    query: Joi.object().keys({
      page: Joi.number()
        .integer()
        .min(1)
        .required(),
      limit: Joi.number()
        .min(1)
        .max(100)
        .integer()
    })
  }
};
