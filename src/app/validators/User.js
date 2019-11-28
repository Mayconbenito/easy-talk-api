const { Joi } = require("celebrate");

module.exports = {
  store: {
    body: Joi.object().keys({
      username: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    })
  }
};
