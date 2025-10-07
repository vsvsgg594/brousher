import Joi from "joi";
import { STATUS_CODES } from "../statuses.utils";
import {
  productSchema,
  updateProductSchema,
  deleteProductSchema,
  getProductByIdSchema,
  getCompleteProductSchema,
  productSearchSchema,
  completeBrochureSchema,
  getCompleteSingleBrochureSchema,
} from "../validations/product.validation";
import {
  deleteVariantSchema,
  getAllVariantsByProductIdSchema,
  getVariantByIdSchema,
  getVariantsByProductSchema,
  updateVariantSchema,
  variantQuerySchema,
  variantSchema,
  variantSearchSchema,
} from "../validations/variant.validation";
import {
  deleteEligibilitySchema,
  eligibilitySchema,
  eligibilitySearchSchema,
  getEligibilityByIdSchema,
  getEligibilityFullDataSchema,
  getVariantsByEligibilitySchema,
  updateEligibilitySchema,
} from "../validations/eligibility.validation";
import {
  deletePremiumRuleSchema,
  getPremiumRuleByIdSchema,
  getPremiumRulesByProductSchema,
  getPremiumRulesByVariantSchema,
  premiumRuleSchema,
  updatePremiumRuleSchema,
} from "../validations/premium.validation";

const convertJoiToFastifySchema = (
  joiSchema: Joi.ObjectSchema,
  property: "body" | "querystring" | "params" = "body"
) => {
  return {
    [property]: {
      type: "object",
    },
  };
};

export const createValidator = (
  schema: Joi.ObjectSchema,
  property: "body" | "query" | "params" = "body"
) => {
  return async (request: any, reply: any) => {
    let dataToValidate;
    switch (property) {
      case "body":
        dataToValidate = request.body;
        break;
      case "query":
        dataToValidate = request.query;
        break;
      case "params":
        dataToValidate = request.params;
        break;
      default:
        dataToValidate = request.body;
    }
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));
      return reply.status(STATUS_CODES.BAD_REQUEST).send({
        success: false,
        message: "Validation failed",
        errors: errorDetails,
      });
    }

    switch (property) {
      case "body":
        request.body = value;
        break;
      case "query":
        request.query = value;
        break;
      case "params":
        request.params = value;
        break;
    }
  };
};

// Product validators
export const validateProduct = createValidator(productSchema);
export const validateUpdateProduct = createValidator(updateProductSchema);
export const validateDeleteProduct = createValidator(
  deleteProductSchema,
  "query"
);
export const validateGetProductById = createValidator(
  getProductByIdSchema,
  "query"
);
export const validateGetCompleteProduct = createValidator(
  getCompleteProductSchema
);
export const validateProductSearch = createValidator(
  productSearchSchema,
  "query"
);
export const validateCompleteBrochure = createValidator(completeBrochureSchema);
export const validateGetCompleteSingleBrochure = createValidator(
  getCompleteSingleBrochureSchema
);

// Variant validators
export const validateVariant = createValidator(variantSchema);
export const validateUpdateVariant = createValidator(updateVariantSchema);
export const validateDeleteVariant = createValidator(
  deleteVariantSchema,
  "query"
);
export const validateGetVariantById = createValidator(
  getVariantByIdSchema,
  "query"
);
export const validateGetVariantsByProduct = createValidator(
  getVariantsByProductSchema,
  "query"
);
export const validateVariantSearch = createValidator(
  variantSearchSchema,
  "query"
);
export const validateGetAllVariantsByProductId = createValidator(
  getAllVariantsByProductIdSchema,
  "body"
);
export const validateVariantQuery = createValidator(
  variantQuerySchema,
  "query"
);

// Eligibility validators
export const validateEligibility = createValidator(eligibilitySchema);
export const validateUpdateEligibility = createValidator(
  updateEligibilitySchema
);
export const validateDeleteEligibility = createValidator(
  deleteEligibilitySchema,
  "query"
);
export const validateGetEligibilityById = createValidator(
  getEligibilityByIdSchema,
  "query"
);
export const validateEligibilitySearch = createValidator(
  eligibilitySearchSchema,
  "query"
);
export const validateGetVariantsByEligibility = createValidator(
  getVariantsByEligibilitySchema,
  "query"
);
export const validateGetEligibilityFullData = createValidator(
  getEligibilityFullDataSchema,
  "query"
);

// Premium rule validators
export const validatePremiumRule = createValidator(premiumRuleSchema);
export const validateUpdatePremiumRule = createValidator(
  updatePremiumRuleSchema
);
export const validateDeletePremiumRule = createValidator(
  deletePremiumRuleSchema,
  "query"
);
export const validateGetPremiumRuleById = createValidator(
  getPremiumRuleByIdSchema,
  "params"
);
export const validateGetPremiumRulesByProduct = createValidator(
  getPremiumRulesByProductSchema,
  "params"
);
export const validateGetPremiumRulesByVariant = createValidator(
  getPremiumRulesByVariantSchema,
  "params"
);
