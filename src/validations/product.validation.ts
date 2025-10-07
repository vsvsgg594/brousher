import Joi from 'joi';

export const productSchema = Joi.object({
  UIN: Joi.string().required().messages({
    'string.empty': 'UIN is required',
    'any.required': 'UIN is required'
  }),
  product_name: Joi.string().required().messages({
    'string.empty': 'Product name is required',
    'any.required': 'Product name is required'
  }),
  insurer: Joi.string().required().messages({
    'string.empty': 'Insurer is required',
    'any.required': 'Insurer is required'
  }),
  jurisdiction: Joi.string().required().messages({
    'any.required': 'Jurisdiction is required'
  }),
  currency: Joi.string().required().messages({
    'string.empty': 'Currency is required',
    'any.required': 'Currency is required'
  }),
  product_tagline: Joi.string().optional().allow('', null),
  product_version: Joi.string().required().messages({
    'string.empty': 'Product version is required',
    'any.required': 'Product version is required'
  }),
  effective_from: Joi.date().optional(),
  effective_to: Joi.date().optional().greater(Joi.ref('effective_from')).messages({
    'date.greater': 'Effective to must be after effective from'
  }),
  notes: Joi.string().optional().allow('', null)
});

export const updateProductSchema = Joi.object({
  product_id: Joi.string().required().messages({
    'any.required': 'Product ID is required'
  }),
  UIN: Joi.string().optional(),
  product_name: Joi.string().optional(),
  insurer: Joi.string().optional(),
  jurisdiction: Joi.string().valid('IN', 'PH', 'MY').optional(),
  currency: Joi.string().optional(),
  product_tagline: Joi.string().optional().allow('', null),
  product_version: Joi.string().optional(),
  effective_from: Joi.date().optional(),
  effective_to: Joi.date().optional().greater(Joi.ref('effective_from')).messages({
    'date.greater': 'Effective to must be after effective from'
  }),
  notes: Joi.string().optional().allow('', null)
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const deleteProductSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': 'Product ID is required'
  })
});

export const getProductByIdSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': 'Product ID is required'
  })
});

export const getCompleteProductSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': 'Product ID is required'
  })
});

export const productSearchSchema = Joi.object({
  search: Joi.string().optional().allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

export const completeBrochureSchema = Joi.object({
  productData: productSchema.required(),
  variantsData: Joi.array().items(
    Joi.object({
      variant: Joi.object({
        variant_name: Joi.string().required(),
        variant_description: Joi.string().optional(),
        eligibility_ids: Joi.string().optional().allow('', null),
        // Add other variant fields as needed
      }).required(),
      eligibilityMaster: Joi.object({
        // Eligibility master fields
      }).optional(),
      premiumRules: Joi.array().items(
        Joi.object({
          // Premium rule fields
        })
      ).optional(),
      linkData: Joi.object().optional()
    })
  ).min(1).required()
});

export const getCompleteSingleBrochureSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': 'Product ID is required'
  })
});