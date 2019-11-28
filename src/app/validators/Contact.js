const { Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  index: {
    query: Joi.object().keys({
      page: Joi.number()
        .integer()
        .required()
    })
  },
  store: {
    params: Joi.object().keys({
      id: Joi.objectId().required()
    })
  }
};
