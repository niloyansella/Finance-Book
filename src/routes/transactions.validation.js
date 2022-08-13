const Joi = require("joi");

const transactionSchema = Joi.object({
  companyName: Joi.string()
    .pattern(/^[a-zA-Z0-9\s_-]+$/, { name: "string" })
    .max(200)
    .required(),
  transactionAmount: Joi.number().max(15000).required(),
  transactionDate: Joi.date().greater("1-1-1974").required(),
  transactionNumber: Joi.string()
    .pattern(/^[a-zA-Z0-9\s_-]+$/, { name: "string" })
    .required(),
  transactionType: Joi.string()
    .valid("Income", "Purchase", "Salary")
    .required(),
  transactionPaymentType: Joi.string().valid("Cash", "Pin").required(),
});

module.exports = { transactionSchema };
