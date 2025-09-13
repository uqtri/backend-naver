import Joi from "@hapi/joi";

export const createSupplierValidation = Joi.object({
  name: Joi.string().required().min(3).max(255).messages({
    "any.required": "Supplier name is required",
    "string.empty": "Supplier name must not be empty",
    "string.min": "Supplier name must be at least 3 characters",
    "string.max": "Supplier name must not be over 255 characters",
  }),

  address: Joi.string().required().min(6).max(255).messages({
    "any.required": "Supplier address is required",
    "string.empty": "Supplier address must not be empty",
    "string.min": "Supplier address must be at least 6 characters",
    "string.max": "Supplier address must not be over 255 characters",
  }),

  phone_number: Joi.string()
    .required()
    .pattern(/^[0-9\s]+$/)
    .min(8)
    .max(12)
    .messages({
      "any.required": "Phone number is required",
      "string.empty": "Phone number must not be empty",
      "string.pattern.base": "Phone number is unvalid",
      "string.min": "Phone number must be at least 8 characters",
      "string.max": "Phone number must not be over 12 characters",
    }),
});

export const updateSupplierValidator = Joi.object({
  name: Joi.string().min(3).max(255).messages({
    "string.empty": "Supplier name must not be empty",
    "string.min": "Supplier name must be at least 3 characters",
    "string.max": "Supplier name must not be over 255 characters",
  }),

  address: Joi.string().min(6).max(255).messages({
    "string.empty": "Supplier address must not be empty",
    "string.min": "Supplier address must be at least 6 characters",
    "string.max": "Supplier address must not be over 255 characters",
  }),

  phone_number: Joi.string()
    .pattern(/^[0-9\s]+$/)
    .min(8)
    .max(12)
    .messages({
      "string.empty": "Phone number must not be empty",
      "string.pattern.base": "Phone number is unvalid",
      "string.min": "Phone number must be at least 8 characters",
      "string.max": "Phone number must not be over 12 characters",
    }),
});
