import Joi from "@hapi/joi";

export const createPurchaseOrderValidator = Joi.object({
  client_id: Joi.string().required().messages({
    "string.empty": "Client ID must not be empty",
    "any.required": "Client ID is required",
  }),
});

export const updatePurchaseOrderValidator = Joi.object({
  client_id: Joi.string().messages({
    "string.empty": "Client ID must not be empty",
  }),
});
