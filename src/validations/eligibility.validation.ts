import Joi from 'joi';

export const eligibilitySchema = Joi.object({
  eligibility_name: Joi.string().trim().required().messages({
    'string.empty': 'Eligibility name is required',
    'any.required': 'Eligibility name is required'
  }),
  insurer: Joi.string().trim().required().messages({
    'string.empty': 'Insurer is required',
    'any.required': 'Insurer is required'
  }),
  jurisdiction: Joi.string().required().messages({
    'any.required': 'Jurisdiction is required'
  }),
  channel: Joi.string().default('any'),
  pay_type: Joi.string().required().messages({
    'any.required': 'Pay type is required'
  }),
  ppt_rule_type: Joi.string().required().messages({
    'any.required': 'PPT rule type is required'
  }),
  ppt_fixed_years: Joi.number().integer().min(1).max(100).optional().allow(null),
  ppt_min_years: Joi.number().integer().min(1).max(100).optional().allow(null),
  ppt_max_years: Joi.number().integer().min(1).max(100).optional().allow(null),
  premium_modes: Joi.string().optional().allow('', null),
  min_policy_term_type: Joi.string().optional().allow(null),
  max_policy_term_type: Joi.string().optional().allow(null),
  min_entry_age: Joi.number().integer().min(0).max(120).optional().allow(null),
  max_entry_age: Joi.number().integer().min(0).max(120).optional().allow(null),
  min_maturity_age: Joi.number().integer().min(0).max(120).optional().allow(null),
  max_maturity_age: Joi.number().integer().min(0).max(120).optional().allow(null),
  min_policy_term_value: Joi.number().min(0).optional().allow(null),
  max_policy_term_value: Joi.number().min(0).optional().allow(null),
  min_base_sum_assured: Joi.number().min(0).optional().allow(null),
  max_base_sum_assured: Joi.number().min(0).optional().allow(null),
  currency: Joi.string().trim().required().messages({
    'string.empty': 'Currency is required',
    'any.required': 'Currency is required'
  }),
  effective_from: Joi.date().optional(),
  effective_to: Joi.date().optional(),
  notes: Joi.string().optional().allow('', null)
});

export const updateEligibilitySchema = Joi.object({
  eligibility_id: Joi.string().required().messages({
    'any.required': 'Eligibility ID is required'
  }),
  eligibility_name: Joi.string().trim().optional(),
  insurer: Joi.string().trim().optional(),
  jurisdiction: Joi.string().optional(),
  channel: Joi.string().optional(),
  pay_type: Joi.string().optional(),
  ppt_rule_type: Joi.string().optional(),
  ppt_fixed_years: Joi.number().integer().min(1).max(100).optional().allow(null),
  ppt_min_years: Joi.number().integer().min(1).max(100).optional().allow(null),
  ppt_max_years: Joi.number().integer().min(1).max(100).optional().allow(null),
  premium_modes: Joi.string().optional().allow('', null),
  min_policy_term_type: Joi.string().optional().allow(null),
  max_policy_term_type: Joi.string().optional().allow(null),
  min_entry_age: Joi.number().integer().min(0).max(120).optional().allow(null),
  max_entry_age: Joi.number().integer().min(0).max(120).optional().allow(null),
  min_maturity_age: Joi.number().integer().min(0).max(120).optional().allow(null),
  max_maturity_age: Joi.number().integer().min(0).max(120).optional().allow(null),
  min_policy_term_value: Joi.number().min(0).optional().allow(null),
  max_policy_term_value: Joi.number().min(0).optional().allow(null),
  min_base_sum_assured: Joi.number().min(0).optional().allow(null),
  max_base_sum_assured: Joi.number().min(0).optional().allow(null),
  currency: Joi.string().trim().optional(),
  effective_from: Joi.date().optional(),
  effective_to: Joi.date().optional(),
  notes: Joi.string().optional().allow('', null)
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const deleteEligibilitySchema = Joi.object({
  eligibilityId: Joi.string().required().messages({
    'any.required': 'Eligibility ID is required'
  })
});

export const getEligibilityByIdSchema = Joi.object({
  eligibilityId: Joi.string().required().messages({
    'any.required': 'Eligibility ID is required'
  })
});

export const eligibilitySearchSchema = Joi.object({
  search: Joi.string().optional().allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

export const getVariantsByEligibilitySchema = Joi.object({
  search: Joi.string().optional().allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

export const getEligibilityFullDataSchema = Joi.object({
  search: Joi.string().optional().allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});