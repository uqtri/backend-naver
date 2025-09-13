import Joi from "@hapi/joi";
export const createServiceOrderDetailsValidator = Joi.object({
  service_order_id: Joi.string().required().messages({
    "string.empty": "Service order ID must not be empty",
    "any.required": "Service order ID is required",
  }),
  extra_cost: Joi.number().required().messages({
    "number.empty": "Extra cost must not be empty",
    "any.required": "Extra cost is required",
  }),
  total_price: Joi.number().required().messages({
    "number.empty": "Total price must not be empty",
    "any.required": "Total price is required",
  }),
  service_id: Joi.string().required().messages({
    "string.empty": "Service ID must not be empty",
    "any.required": "Service ID is required",
  }),
  quantity: Joi.number().required().greater(0).messages({
    "any.required": "Quantity is required",
    "number.greater": "Quantity must be greater than 0",
  }),
  paid: Joi.number().required().messages({
    "number.empty": "Paid amount must not be empty",
    "any.required": "Paid amount is required",
  }),
  remaining: Joi.number().required().messages({
    "number.empty": "Remaining amount must not be empty",
    "any.required": "Remaining amount is required",
  }),
  calculated_price: Joi.number().required().messages({
    "number.empty": "Calculated price must not be empty",
    "any.required": "Calculated price is required",
  }),
});
export const getServiceOrderDetailsValidator = Joi.object({
  service_order_id: Joi.string().required().messages({
    "string.empty": "Service order ID must not be empty",
    "any.required": "Service order ID is required",
  }),
  service_id: Joi.string().required().messages({
    "string.empty": "Service ID must not be empty",
    "any.required": "Service ID is required",
  }),
});
export const updateServiceOrderDetailsValidator = Joi.object({
  service_order_id: Joi.string().required().messages({
    "string.empty": "Service order ID must not be empty",
    "any.required": "Service order ID is required",
  }),
  extra_cost: Joi.number().required().messages({
    "number.empty": "Extra cost must not be empty",
    "any.required": "Extra cost is required",
  }),
  total_price: Joi.number().messages({
    "number.empty": "Total price must not be empty",
    "any.required": "Total price is required",
  }),
  status: Joi.string().messages({
    "string.empty": "Status must not be empty",
    "any.required": "Status is required",
  }),
  service_id: Joi.string().required().messages({
    "string.empty": "Service ID must not be empty",
    "any.required": "Service ID is required",
  }),
  quantity: Joi.number().greater(0).messages({
    "any.required": "Quantity is required",
    "number.greater": "Quantity must be greater than 0",
  }),
  paid: Joi.number().messages({
    "number.empty": "Paid amount must not be empty",
    "any.required": "Paid amount is required",
  }),
  remaining: Joi.number().messages({
    "number.empty": "Remaining amount must not be empty",
    "any.required": "Remaining amount is required",
  }),
  calculated_price: Joi.number().messages({
    "number.empty": "Calculated price must not be empty",
    "any.required": "Calculated price is required",
  }),
});

export const deleteServiceOrderDetailsValidator = Joi.object({
  service_order_id: Joi.string().required().messages({
    "string.empty": "Service order ID must not be empty",
    "any.required": "Service order ID is required",
  }),
  service_id: Joi.string().required().messages({
    "string.empty": "Service ID must not be empty",
    "any.required": "Service ID is required",
  }),
});
