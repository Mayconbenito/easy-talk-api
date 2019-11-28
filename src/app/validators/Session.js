const { Joi } = require("celebrate");

module.exports = {
  store: {
    body: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    })
  }
};
