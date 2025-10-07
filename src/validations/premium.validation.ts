import Joi from 'joi';

export const premiumRuleSchema = Joi.object({
  product_id: Joi.string().required().messages({
    'any.required': 'Product ID is required'
  }),
  variant_id: Joi.string().optional().allow(null, ''),
  min_age: Joi.number().integer().min(0).max(120).required().messages({
    'number.min': 'Min age cannot be negative',
    'number.max': 'Min age cannot exceed 120',
    'any.required': 'Min age is required'
  }),
  max_age: Joi.number().integer().min(0).max(120).required().messages({
    'number.min': 'Max age cannot be negative',
    'number.max': 'Max age cannot exceed 120',
    'any.required': 'Max age is required'
  }),
  min_term: Joi.number().integer().min(0).required().messages({
    'number.min': 'Min term cannot be negative',
    'any.required': 'Min term is required'
  }),
  max_term: Joi.number().integer().min(0).required().messages({
    'number.min': 'Max term cannot be negative',
    'any.required': 'Max term is required'
  }),
  min_premium: Joi.number().min(0).required().messages({
    'number.min': 'Min premium cannot be negative',
    'any.required': 'Min premium is required'
  }),
  max_premium: Joi.number().min(0).required().messages({
    'number.min': 'Max premium cannot be negative',
    'any.required': 'Max premium is required'
  }),
  min_sum_assured: Joi.number().min(0).required().messages({
    'number.min': 'Min sum assured cannot be negative',
    'any.required': 'Min sum assured is required'
  }),
  max_sum_assured: Joi.number().min(0).required().messages({
    'number.min': 'Max sum assured cannot be negative',
    'any.required': 'Max sum assured is required'
  }),
  effective_from: Joi.date().optional(),
  effective_to: Joi.date().optional(),
  notes: Joi.string().optional().allow('', null)
}).custom((value, helpers) => {
  // Custom validation for age range
  if (value.min_age > value.max_age) {
    return helpers.error('any.invalid', { message: 'Min age cannot be greater than max age' });
  }

  // Custom validation for term range
  if (value.min_term > value.max_term) {
    return helpers.error('any.invalid', { message: 'Min term cannot be greater than max term' });
  }

  // Custom validation for premium range
  if (value.min_premium > value.max_premium) {
    return helpers.error('any.invalid', { message: 'Min premium cannot be greater than max premium' });
  }

  // Custom validation for sum assured range
  if (value.min_sum_assured > value.max_sum_assured) {
    return helpers.error('any.invalid', { message: 'Min sum assured cannot be greater than max sum assured' });
  }

  return value;
});

export const updatePremiumRuleSchema = Joi.object({
  minprem_id: Joi.string().required().messages({
    'any.required': 'Premium rule ID is required'
  }),
  product_id: Joi.string().optional(),
  variant_id: Joi.string().optional().allow(null, ''),
  min_age: Joi.number().integer().min(0).max(120).optional(),
  max_age: Joi.number().integer().min(0).max(120).optional(),
  min_term: Joi.number().integer().min(0).optional(),
  max_term: Joi.number().integer().min(0).optional(),
  min_premium: Joi.number().min(0).optional(),
  max_premium: Joi.number().min(0).optional(),
  min_sum_assured: Joi.number().min(0).optional(),
  max_sum_assured: Joi.number().min(0).optional(),
  effective_from: Joi.date().optional(),
  effective_to: Joi.date().optional(),
  notes: Joi.string().optional().allow('', null)
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const deletePremiumRuleSchema = Joi.object({
  ruleId: Joi.string().required().messages({
    'any.required': 'Premium rule ID is required'
  })
});

export const getPremiumRuleByIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'Premium rule ID is required'
  })
});

export const getPremiumRulesByProductSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': 'Product ID is required'
  })
});

export const getPremiumRulesByVariantSchema = Joi.object({
  variantId: Joi.string().required().messages({
    'any.required': 'Variant ID is required'
  })
});