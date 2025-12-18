import Joi from "joi";

const name = Joi.string().max(50).messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required !",
    "string.empty": "Name is required !",
});

export const createCategorySchema = Joi.object({
    name: name.required() 
});

export const updateCategorySchema = Joi.object({
    name: name 
});