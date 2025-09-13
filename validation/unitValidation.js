import Joi from "@hapi/joi";

export const createUnitValidator = Joi.object({
  name: Joi.string().min(1).max(10).required().messages({
    "any.required": "Unit name is required",
    "string.empty": "Unit name must not be empty",
    "string.min": "Unit name must be at least 1 character",
    "string.max": "Unit name must not be over 10 characters",
  }),
});

export const updateUnitValidator = Joi.object({
  name: Joi.string().min(1).max(10).messages({
    "string.empty": "Unit name must not be empty",
    "string.min": "Unit name must be at least 1 character",
    "string.max": "Unit name must not be over 10 characters",
  }),
});
