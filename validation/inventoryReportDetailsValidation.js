import Joi from "@hapi/joi";

export const createInventoryReportDetailValidator = Joi.object({
  report_id: Joi.string().required().messages({
    "string.empty": "Report ID must not be empty",
    "any.required": "Report ID is required",
  }),
  product_id: Joi.string().required().messages({
    "string.empty": "Product ID must not be empty",
    "any.required": "Product ID is required",
  }),
  begin_stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Begin stock must be a number",
    "number.integer": "Begin stock must be an integer",
    "number.min": "Begin stock must be greater than or equal to 0",
    "any.required": "Begin stock is required",
  }),
  buy_quantity: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Buy quantity must be a number",
    "number.integer": "Buy quantity must be an integer",
    "number.min": "Buy quantity must be greater than or equal to 0",
  }),
  sell_quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Sell quantity must be a number",
    "number.integer": "Sell quantity must be an integer",
    "number.min": "Sell quantity must be greater than or equal to 0",
    "any.required": "Sell quantity is required",
  }),
});

export const updateInventoryReportDetailValidator = Joi.object({
  begin_stock: Joi.number().integer().min(0).messages({
    "number.base": "Begin stock must be a number",
    "number.integer": "Begin stock must be an integer",
    "number.min": "Begin stock must be greater than or equal to 0",
  }),
  buy_quantity: Joi.number().integer().min(0).messages({
    "number.base": "Buy quantity must be a number",
    "number.integer": "Buy quantity must be an integer",
    "number.min": "Buy quantity must be greater than or equal to 0",
  }),
  sell_quantity: Joi.number().integer().min(0).messages({
    "number.base": "Sell quantity must be a number",
    "number.integer": "Sell quantity must be an integer",
    "number.min": "Sell quantity must be greater than or equal to 0",
  }),
});
