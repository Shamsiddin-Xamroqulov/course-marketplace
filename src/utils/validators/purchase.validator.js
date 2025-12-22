import Joi from "joi";

const user_id = Joi.number().integer().messages({
  "number.base": "User ID must be a number",
  "number.integer": "User ID must be an integer",
  "any.required": "User ID is required",
});

const course_id = Joi.number().integer().messages({
  "number.base": "Course ID must be a number",
  "number.integer": "Course ID must be an integer",
  "any.required": "Course ID is required",
});

const total_price = Joi.number()
  .precision(2)
  .min(0)
  .max(9999999999.99)
  .required()
  .messages({
    "number.base": "Total price must be a number",
    "number.precision": "Total price must have at most 2 decimal places",
    "number.min": "Total price cannot be negative",
    "number.max": "Total price exceeds maximum allowed value",
    "any.required": "Total price is required",
  });

const purchase_date = Joi.date().messages({
  "date.base": "Purchase date must be a valid date",
  "any.required": "Purchase date is required",
});

export const createPurchaseSchema = Joi.object({
  user_id: user_id.required(),
  course_id: course_id.required(),
  total_price: total_price.required(),
  purchase_date: purchase_date.required(),
});

export const updatePurchaseSchema = Joi.object({
    total_price,
    purchase_date,
});