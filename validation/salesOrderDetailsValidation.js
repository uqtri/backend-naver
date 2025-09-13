import Joi from "@hapi/joi";

export const getSalesOrderDetailsValidator = Joi.object({
  sales_order_id: Joi.string().required().messages({
    "string.empty": "Sales order ID must not be empty",
    "any.required": "Sales order ID is required",
  }),
  product_id: Joi.string().required().messages({
    "string.empty": "Product ID must not be empty",
    "any.required": "Product ID is required",
  }),
});
export const deleteSalesOrderDetailsValidator = Joi.object({
  sales_order_id: Joi.string().required().messages({
    "string.empty": "Sales order ID must not be empty",
    "any.required": "Sales order ID is required",
  }),
  product_id: Joi.string().required().messages({
    "string.empty": "Product ID must not be empty",
    "any.required": "Product ID is required",
  }),
});
export const updateSalesOrderDetailsValidator = Joi.object({
  sales_order_id: Joi.string().required().messages({
    "string.empty": "Sales order ID must not be empty",
    "any.required": "Sales order ID is required",
  }),
  product_id: Joi.string().required().messages({
    "string.empty": "Product ID must not be empty",
    "any.required": "Product ID is required",
  }),
  quantity: Joi.number().greater(0).messages({
    "number.greater": "Quantity must be greater than 0",
  }),
  total_price: Joi.number().greater(0).messages({
    "number.greater": "Price must be greater than 0",
  }),
});
export const createSalesOrderDetailsValidator = Joi.object({
  sales_order_id: Joi.string().required().messages({
    "string.empty": "Sales order ID must not be empty",
    "any.required": "Sales order ID is required",
  }),
  product_id: Joi.string().required().messages({
    "string.empty": "Product ID must not be empty",
    "any.required": "Product ID is required",
  }),
  quantity: Joi.number().required().greater(0).messages({
    "any.required": "Quantity is required",
    "number.greater": "Quantity must be greater than 0",
  }),
  total_price: Joi.number().required().greater(0).messages({
    "any.required": "Price is required",
    "number.greater": "Price must be greater than 0",
  }),
});
