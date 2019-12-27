import { Joi } from "celebrate";

export default {
  index: {
    query: Joi.object().keys({
      searchText: Joi.string().required(),
      limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
    })
  }
};
