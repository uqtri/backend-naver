import Joi from "@hapi/joi";

export const createProductValidator = Joi.object({
  name: Joi.string().min(6).max(255).required().messages({
    "string.empty": "Product name must not be empty",
    "any.required": "Product name is required",
    "string.min": "Product name must be at least 6 characters",
    "string.max": "Product name must not be over 255 characters",
  }),
  type: Joi.string().required().messages({
    "string.empty": "Product type must not be empty",
    "any.required": "Product type is required",
  }),

  unit: Joi.string().required().messages({
    "string.empty": "Product unit must not be empty",
    "any.required": "Product unit is required",
  }),
  description: Joi.string().min(6).max(1000).required().messages({
    "string.empty": "Product description must not be empty",
    "any.required": "Product description is required",
    "string.min": "Product description must be at least 6 characters",
    "string.max": "Product description must not be over 1000 characters",
  }),
  buy_price: Joi.number().required().greater(0).messages({
    "any.required": "Product buy price is required",
    "number.greater": "Product buy price must be greater than 0",
  }),
  supplier_id: Joi.string().required().messages({
    "string.empty": "Product supplier ID must not be empty",
    "any.required": "Product supplier ID is required",
  }),
});

export const updateProductValidator = Joi.object({
  name: Joi.string().min(6).max(255).messages({
    "string.empty": "Product name must not be empty",
    "string.min": "Product name must be at least 6 characters",
    "string.max": "Product name must not be over 255 characters",
  }),
  type: Joi.string().messages({
    "string.empty": "Product type must not be empty",
  }),
  unit: Joi.string().messages({
    "string.empty": "Product unit must not be empty",
  }),
  description: Joi.string().min(6).max(1000).messages({
    "string.empty": "Product description must not be empty",
    "string.min": "Product description must be at least 6 characters",
    "string.max": "Product description must not be over 1000 characters",
  }),
  buy_price: Joi.number().greater(0).messages({
    "number.greater": "Product buy price must be greater than 0",
  }),
  supplier_id: Joi.string().messages({
    "string.empty": "Product supplier ID must not be empty",
  }),
});
