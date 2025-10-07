import Joi from "joi";

const COMMON_VALIDATION = {
  UUID: Joi.string().required().messages({
    "any.required": "ID is required",
  }),
  TEXT: Joi.string().trim().min(1).required().messages({
    "string.empty": "This field cannot be empty",
    "any.required": "This field is required",
  }),
  OPTIONAL_TEXT: Joi.string().trim().optional().allow("", null),
  DATE: Joi.date().optional(),
  NOTES: Joi.string().optional().allow("", null),
  PAGE: Joi.number().integer().min(1).default(1),
  LIMIT: Joi.number().integer().min(1).max(100).default(10),
};

export const variantSchema = Joi.object({
  product_id: COMMON_VALIDATION.UUID.messages({
    "any.required": "Product ID is required",
  }),
  variant_code: COMMON_VALIDATION.TEXT.min(5).max(8).messages({
    "string.max": "Variant code cannot exceed 8 characters",
  }),
  variant_label: COMMON_VALIDATION.TEXT.max(200).messages({
    "string.max": "Variant label cannot exceed 200 characters",
  }),
  variant_description: COMMON_VALIDATION.OPTIONAL_TEXT.max(500).messages({
    "string.max": "Variant description cannot exceed 500 characters",
  }),
  effective_from: COMMON_VALIDATION.DATE,
  effective_to: COMMON_VALIDATION.DATE.greater(
    Joi.ref("effective_from")
  ).messages({
    "date.greater": "Effective to must be after effective from",
  }),
  notes: COMMON_VALIDATION.NOTES,
  eligibility_id: Joi.string().optional().allow("", null).messages({
    "string.base": "Eligibility ID must be a string",
  }),
})
  .and("effective_from", "effective_to")
  .messages({
    "object.and":
      "Both effective_from and effective_to must be provided together",
  });

export const updateVariantSchema = Joi.object({
  variant_id: COMMON_VALIDATION.UUID.messages({
    "any.required": "Variant ID is required for update",
  }),
  product_id: COMMON_VALIDATION.UUID,
  variant_code: COMMON_VALIDATION.TEXT.max(100).optional(),
  variant_label: COMMON_VALIDATION.TEXT.max(200).optional(),
  variant_description: COMMON_VALIDATION.OPTIONAL_TEXT.max(500).optional(),
  effective_from: COMMON_VALIDATION.DATE,
  effective_to: COMMON_VALIDATION.DATE.greater(
    Joi.ref("effective_from")
  ).messages({
    "date.greater": "Effective to must be after effective from",
  }),
  notes: COMMON_VALIDATION.NOTES,
  eligibility_id: Joi.string().optional().allow("", null).messages({
    "string.base": "Eligibility ID must be a string",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

export const deleteVariantSchema = Joi.object({
  variantId: COMMON_VALIDATION.UUID.messages({
    "any.required": "Variant ID is required",
  }),
});

export const getVariantByIdSchema = Joi.object({
  variantId: COMMON_VALIDATION.UUID.messages({
    "any.required": "Variant ID is required",
  }),
});

export const getVariantsByProductSchema = Joi.object({
  productId: COMMON_VALIDATION.UUID.messages({
    "any.required": "Product ID is required",
  }),
});

export const variantSearchSchema = Joi.object({
  search: Joi.string().optional().allow("", null).max(100).messages({
    "string.max": "Search query cannot exceed 100 characters",
  }),
  page: COMMON_VALIDATION.PAGE,
  limit: COMMON_VALIDATION.LIMIT,
});

export const getAllVariantsByProductIdSchema = Joi.object({
  product_id: COMMON_VALIDATION.UUID.messages({
    "any.required": "Product ID is required",
  }),
  page: COMMON_VALIDATION.PAGE,
  limit: COMMON_VALIDATION.LIMIT,
});

export const variantQuerySchema = Joi.object({
  variantId: COMMON_VALIDATION.UUID,
  productId: COMMON_VALIDATION.UUID,
  search: Joi.string().optional().allow("", null),
  page: COMMON_VALIDATION.PAGE,
  limit: COMMON_VALIDATION.LIMIT,
});
