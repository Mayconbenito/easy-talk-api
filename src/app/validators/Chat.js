import { Joi } from "celebrate";
import joiObjectId from "joi-objectid";

Joi.objectId = joiObjectId(Joi);
export default {
  store: {
    body: Joi.object().keys({
      participants: Joi.array()
        .min(1)
        .max(1)
        .items(Joi.objectId().required())
        .required()
    })
  }
};
