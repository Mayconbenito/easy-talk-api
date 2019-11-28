const { Joi } = require("celebrate");

module.exports = {
  index: {
    query: Joi.object().keys({
      searchText: Joi.string().required(),
      page: Joi.number()
        .integer()
        .required()
    })
  }
};
