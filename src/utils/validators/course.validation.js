import Joi from "joi";

const instructor_id = Joi.number().integer().positive().messages({
  "number.base": "Instructor ID must be a number",
  "number.integer": "Instructor ID must be an integer",
  "number.positive": "Instructor ID must be positive",
  "any.required": "Instructor ID is required",
});

const category_id = Joi.number().integer().positive().messages({
  "number.base": "Category ID must be a number",
  "number.integer": "Category ID must be an integer",
  "number.positive": "Category ID must be positive",
  "any.required": "Category ID is required",
});

const name = Joi.string().min(3).max(255).messages({
  "string.base": "Course name must be a string",
  "string.min": "Course name must be at least 3 characters",
  "string.max": "Course name must be at most 255 characters",
  "any.required": "Course name is required",
});

const description = Joi.string().min(10).messages({
  "string.base": "Description must be a string",
  "string.min": "Description must be at least 10 characters",
  "any.required": "Description is required",
});

const price = Joi.number()
  .precision(2)
  .min(0)
  .max(9999999999.99)
  .required()
  .messages({
    "number.base": "Price must be a number",
    "number.precision": "Price must have at most 2 decimal places",
    "number.min": "Price cannot be negative",
    "number.max": "Price exceeds maximum allowed value",
    "any.required": "Price is required",
  });

const level = Joi.string()
  .valid("beginner", "intermediate", "advanced")
  .default("beginner")
  .messages({
    "any.only": "Level must be one of beginner, intermediate, advanced",
  });

const is_free = Joi.boolean().messages({
  "boolean.base": "is_free must be true or false",
  "any.required": "is_free is required",
});

const lesson_count = Joi.number().integer().min(0).messages({
  "number.base": "Lesson count must be a number",
  "number.integer": "Lesson count must be an integer",
  "number.min": "Lesson count cannot be negative",
  "any.required": "Lesson count is required",
});

const technologies = Joi.array()
  .items(Joi.string().trim().min(2).max(50))
  .min(1)
  .messages({
    "array.base": "Technologies must be an array",
    "array.min": "At least one technologies is required",
    "any.required": "Technologies field is required",
  });

export const createCourseSchema = Joi.object({
  instructor_id: instructor_id.required(),
  category_id: category_id.required(),
  name: name.required(),
  description: description.required(),
  price: price.required(),
  level: level.required(),
  is_free: is_free.required(),
  lesson_count: lesson_count.required(),
  technologies: technologies.required(),
});

export const updateCourseSchema = Joi.object({
  instructor_id,
  category_id,
  name,
  description,
  price,
  level,
  is_free,
  lesson_count,
  technologies,
});
