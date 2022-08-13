const Joi = require("joi");

const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]+$")),
});

const signUpSchema = Joi.object({
  username: Joi.string().alphanum().min(3),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]+$")),
  password2: Joi.ref("password"),
});

module.exports = { loginSchema, signUpSchema };
