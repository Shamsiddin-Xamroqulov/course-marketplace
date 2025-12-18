import Joi from "joi";

const first_name = Joi.string().min(2).max(50).messages({
  "string.base": "First name must be a string",
  "string.empty": "First name is required",
  "string.min": "First name must be at least 2 characters",
  "string.max": "First name must be less than 50 characters",
  "any.required": "First name is required",
});

const last_name = Joi.string().min(2).max(50).messages({
  "string.base": "Last name must be a string",
  "string.empty": "Last name is required",
  "string.min": "Last name must be at least 2 characters",
  "string.max": "Last name must be less than 50 characters",
  "any.required": "Last name is required",
});

const email = Joi.string().email().messages({
  "string.email": "Email must be a valid email address",
  "string.empty": "Email is required",
  "any.required": "Email is required",
});

const password = Joi.string().min(6).max(100).messages({
  "string.base": "Password must be a string",
  "string.empty": "Password is required",
  "string.min": "Password must be at least 6 characters",
  "string.max": "Password must be less than 100 characters",
  "any.required": "Password is required",
});

const phone_number = Joi.string()
  .pattern(/^\+998\d{9}$/)
  .messages({
    "string.pattern.base": "Phone number must be in +998XXXXXXXXX format",
    "string.empty": "Phone number is required",
    "any.required": "Phone number is required",
  });

const bio = Joi.string().max(500).messages({
  "string.max": "Bio must be less than 500 characters",
});

const skills = Joi.array()
  .items(Joi.string().trim().min(2).max(50))
  .min(1)
  .messages({
    "array.base": "Skills must be an array",
    "array.min": "At least one skill is required",
    "any.required": "Skills field is required",
  });

const avatar = Joi.string().uri().allow(null, "").messages({
  "string.uri": "Avatar must be a valid URL",
});
const photo_id = Joi.string().allow(null, "");

export const createInstructorSchema = Joi.object({
  first_name: first_name.required(),
  last_name: last_name.required(),
  email: email.required(),
  password: password.required(),
  phone_number: phone_number.required(),
});

export const updateInstructorSchema = Joi.object({
  first_name,
  last_name,
  email,
  password,
  phone_number,
  bio,
  skills,
  avatar,
  photo_id
});
