import Joi from "joi";

const email = Joi.string().email().required().messages({
  "string.base": "Email must be a string",
  "string.email": "Email must be a valid email address",
  "string.empty": "Email cannot be empty",
  "any.required": "Email is required",
});

const otp = Joi.number()
  .integer()
  .required()
  .messages({
    "string.base": "OTP must be a string",
    "string.length": "OTP must be exactly 6 digits",
    "string.pattern.base": "OTP must contain only digits",
    "any.required": "OTP is required",
  });

export const changePasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  new_password: Joi.string().min(6).max(100).required().messages({
    "string.base": "New password must be a string",
    "string.min": "New password should have at least 6 characters",
    "string.max": "New password should have at most 100 characters",
    "any.required": "New password is required",
  }),
});

export const verifySchema = Joi.object({ email, otp });
export const resendSchema = Joi.object({ email });