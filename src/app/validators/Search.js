import { Joi } from "celebrate";

export default {
  index: {
    query: Joi.object().keys({
      searchText: Joi.string().required(),
      page: Joi.number()
        .integer()
        .required(),
      limit: Joi.number().integer()
    })
  }
};
