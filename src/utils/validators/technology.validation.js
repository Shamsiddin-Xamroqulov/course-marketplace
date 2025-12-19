import Joi from "joi";

export const technologySchema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required().messages({
    "string.base": "Technology name must be a string",
    "string.empty": "Technology name cannot be empty",
    "string.min": "Technology name must be at least 2 characters long",
    "string.max": "Technology name must not exceed 50 characters",
    "any.required": "Technology name is required",
  }),
});