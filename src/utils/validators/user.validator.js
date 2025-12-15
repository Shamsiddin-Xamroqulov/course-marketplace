import Joi from "joi";

export const createUserSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).required().messages({
    "string.base": "First name must be a string",
    "string.empty": "First name is required",
    "string.min": "First name should have at least 2 characters",
    "string.max": "First name should have at most 50 characters",
    "any.required": "First name is required",
  }),
  last_name: Joi.string().min(2).max(50).required().messages({
    "string.base": "Last name must be a string",
    "string.empty": "Last name is required",
    "string.min": "Last name should have at least 2 characters",
    "string.max": "Last name should have at most 50 characters",
    "any.required": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "string.min": "Password should have at least 6 characters",
    "string.max": "Password should have at most 100 characters",
    "any.required": "Password is required",
  }),
  phone_number: Joi.string()
    .pattern(/^\+998[0-9]{9}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be in format +998XXXXXXXXX",
      "string.empty": "Phone number is required",
      "any.required": "Phone number is required",
    }),
  role: Joi.string()
    .valid("student", "instructor", "admin")
    .default("student")
    .messages({
      "any.only": "Role must be one of student, instructor, or admin",
    }),
  avatar: Joi.string().uri().optional().messages({
    "string.uri": "Avatar must be a valid URL",
  }),
  photo_id: Joi.string().optional(),
  otp: Joi.number().integer().allow(null),
  otp_time: Joi.date().allow(null),
  is_verified: Joi.boolean().default(false),
});

export const updateUserSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).messages({
    "string.base": "First name must be a string",
    "string.min": "First name should have at least 2 characters",
    "string.max": "First name should have at most 50 characters",
  }),
  last_name: Joi.string().min(2).max(50).messages({
    "string.base": "Last name must be a string",
    "string.min": "Last name should have at least 2 characters",
    "string.max": "Last name should have at most 50 characters",
  }),
  email: Joi.string().email().messages({
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().min(6).max(100).messages({
    "string.min": "Password should have at least 6 characters",
    "string.max": "Password should have at most 100 characters",
  }),
  phone_number: Joi.string()
    .pattern(/^\+998[0-9]{9}$/)
    .allow(null, "")
    .messages({
      "string.pattern.base": "Phone number must be in format +998XXXXXXXXX",
      "string.empty": "Phone number is required",
      "any.required": "Phone number is required",
    }),
  role: Joi.string().valid("student", "instructor", "admin").messages({
    "any.only": "Role must be one of student, instructor, or admin",
  }),
  avatar: Joi.string().uri().allow(null, "").messages({
    "string.uri": "Avatar must be a valid URL",
  }),
  photo_id: Joi.string().allow(null, ""),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "string.min": "Password should have at least 6 characters",
    "string.max": "Password should have at most 100 characters",
    "any.required": "Password is required",
  }),
});