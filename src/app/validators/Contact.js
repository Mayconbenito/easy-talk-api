import { Joi } from "celebrate";
import joiObjectId from "joi-objectid";

Joi.objectId = joiObjectId(Joi);

export default {
  index: {
    query: Joi.object().keys({
      page: Joi.number()
        .integer()
        .required(),
      limit: Joi.number().integer()
    })
  },
  store: {
    params: Joi.object().keys({
      id: Joi.objectId().required()
    })
  }
};
