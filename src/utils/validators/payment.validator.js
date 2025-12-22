import Joi from "joi";

const purchase_id = Joi.number().integer().messages({
  "number.base": "Purchase ID must be a number",
  "number.integer": "Purchase ID must be an integer",
});

const user_id = Joi.number().integer().messages({
  "number.base": "User ID must be a number",
  "number.integer": "User ID must be an integer",
});

const amount = Joi.number().precision(2).positive().messages({
  "number.base": "Amount must be a number",
  "number.positive": "Amount must be positive",
});

const status = Joi.string()
  .valid("pending", "paid", "canceled")
  .default("pending")
  .messages({
    "string.base": "Status must be a string",
    "any.only": "Status must be either 'pending', 'paid', or 'canceled'",
  });

const transaction_id = Joi.string().allow(null, "").default(null).messages({
  "string.base": "Transaction ID must be a string",
});

const paid_at = Joi.date().allow(null, "").default(null).messages({
  "date.base": "Paid at must be a valid date",
});

export const createPaymentSchema = Joi.object({
  purchase_id: purchase_id.required(),
  user_id: user_id.required(),
  amount: amount.required(),
  status,
  transaction_id,
});

export const updatePaymentSchema = Joi.object({
  status,
  transaction_id,
  paid_at,
});
