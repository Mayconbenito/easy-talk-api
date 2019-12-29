import { Joi } from "celebrate";
import joiObjectId from "joi-objectid";

Joi.objectId = joiObjectId(Joi);

export default {
  store: {
    body: Joi.object().keys({
      message: Joi.string().required()
    }),
    params: Joi.object().keys({
      reciverId: Joi.objectId().required()
    })
  }
};
