import Joi from "joi";

const course_id = Joi.number().integer().positive().messages({
  "number.base": "Course ID must be a number",
  "number.integer": "Course ID must be an integer",
  "number.positive": "Course ID must be a positive number",
  "any.required": "Course ID is required",
});

const title = Joi.string().min(3).max(255).messages({
  "string.base": "Title must be a string",
  "string.min": "Title must be at least 3 characters long",
  "string.max": "Title must be at most 255 characters long",
  "any.required": "Title is required",
});

const duration = Joi.string()
  .pattern(/^\d{1,2}:\d{2}(:\d{2})?$/)
  .messages({
    "string.base": "Duration must be a string",
    "string.pattern.base": "Duration must be in format mm:ss or hh:mm:ss",
    "any.required": "Duration is required",
  });

export const createLessonSchema = Joi.object({
    course_id: course_id.required(),
    title: title.required(),
    duration: duration.required()
});

export const updateLessonSchema = Joi.object({
    course_id,
    title,
    duration
});