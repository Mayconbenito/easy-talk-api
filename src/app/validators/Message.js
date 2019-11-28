const { Joi } = require("celebrate");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  store: {
    body: Joi.object().keys({
      message: Joi.string().required()
    }),
    params: Joi.object().keys({
      toId: Joi.objectId().required()
    })
  }
};
