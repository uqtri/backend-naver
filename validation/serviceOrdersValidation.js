import Joi from "@hapi/joi";

export const createServiceOrderValidator = Joi.object({
  // service_order_id: Joi.string().required().messages({
  //   "string.empty": "Service order ID must not be empty",
  //   "any.required": "Service order ID is required",
  // }),
  client_id: Joi.string().messages({
    "string.empty": "Client ID must not be empty",
    "any.required": "Client ID is required",
  }),
  total_price: Joi.number().messages({
    "any.required": "Price is required",
  }),
  total_paid: Joi.number().messages({
    "any.required": "Total paid is required",
  }),
  status: Joi.string().messages({
    "string.empty": "Status must not be empty",
    "any.required": "Status is required",
  }),
  total_remaining: Joi.number().messages({
    "number.empty": "Total remaining must not be empty",
    "any.required": "Total remaining is required",
  }),
});

export const getServiceOrderValidator = Joi.object({
  service_order_id: Joi.string().required().messages({
    "string.empty": "Service order ID must not be empty",
    "any.required": "Service order ID is required",
  }),
});

export const updateServiceOrderValidator = Joi.object({
  service_order_id: Joi.string().required().messages({
    "string.empty": "Service order ID must not be empty",
    "any.required": "Service order ID is required",
  }),
  client_id: Joi.string().required().messages({
    "string.empty": "Client ID must not be empty",
    "any.required": "Client ID is required",
  }),
  total_price: Joi.number().greater(0).messages({
    "number.greater": "Price must be greater than 0",
  }),
  total_paid: Joi.number().greater(0).messages({
    "number.greater": "Total paid must be greater than 0",
  }),
  status: Joi.string().required().messages({
    "string.empty": "Status must not be empty",
    "any.required": "Status is required",
  }),
  total_remaining: Joi.number().required().messages({
    "number.empty": "Total remaining must not be empty",
    "any.required": "Total remaining is required",
  }),
});
export const deleteServiceOrderValidator = Joi.object({
  service_order_id: Joi.string().required().messages({
    "string.empty": "Service order ID must not be empty",
    "any.required": "Service order ID is required",
  }),
});
