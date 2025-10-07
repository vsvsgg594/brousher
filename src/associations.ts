import { Product } from "./models/brochure/product.model";
import { PlanVariant } from "./models/brochure/planVariant.model";
import { EligibilityMaster } from "./models/brochure/variantEligibility.model";
import { MinPremiumRule } from "./models/brochure/minPremiumRule.model";
import { VariantEligibilityLink } from "./models/brochure/variantEligibilityLink.model";
import { BrochureSummary } from "./models/brochure/aiBrochuresSummary.model";

const defineAssociations = () => {
  Product.hasMany(PlanVariant, {
    foreignKey: "product_id",
    as: "variants",
  });

  PlanVariant.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
  });

  PlanVariant.hasMany(MinPremiumRule, {
    foreignKey: "variant_id",
    as: "premiumRules",
  });

  MinPremiumRule.belongsTo(PlanVariant, {
    foreignKey: "variant_id",
    as: "variant",
  });

  Product.hasMany(MinPremiumRule, {
    foreignKey: "product_id",
    as: "premiumRules",
  });

  MinPremiumRule.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
  });

  PlanVariant.belongsToMany(EligibilityMaster, {
    through: VariantEligibilityLink,
    foreignKey: "variant_id",
    otherKey: "eligibility_id",
    as: "eligibilities",
  });

  EligibilityMaster.belongsToMany(PlanVariant, {
    through: VariantEligibilityLink,
    foreignKey: "eligibility_id",
    otherKey: "variant_id",
    as: "variants",
  });

  VariantEligibilityLink.belongsTo(PlanVariant, {
    foreignKey: "variant_id",
    as: "variant",
  });

  VariantEligibilityLink.belongsTo(EligibilityMaster, {
    foreignKey: "eligibility_id",
    as: "eligibility",
  });

  PlanVariant.hasMany(VariantEligibilityLink, {
    foreignKey: "variant_id",
    as: "eligibilityLinks",
  });

  EligibilityMaster.hasMany(VariantEligibilityLink, {
    foreignKey: "eligibility_id",
    as: "variantLinks",
  });

  Product.hasOne(BrochureSummary, {
    foreignKey: "product_id",
    as: "brochureSummary",
  });

  BrochureSummary.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
  });
};

export default defineAssociations;
