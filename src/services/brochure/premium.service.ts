import {
  MinPremiumRule,
  MinPremiumRuleData,
} from "../../models/brochure/minPremiumRule.model";
import { Product } from "../../models/brochure/product.model";
import { PlanVariant } from "../../models/brochure/planVariant.model";
import { generateUUID } from "../../utils/constants.utils";

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

class PremiumService {
  createPremiumRule = async (premiumRuleData: MinPremiumRuleData) => {
    try {
      return await MinPremiumRule.create({
        minprem_id: generateUUID(),
        ...premiumRuleData,
      });
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to create premium rule: ${error.message}`
      );
    }
  };

  getAllPremiumRules = async () => {
    try {
      return await MinPremiumRule.findAll({
        include: [
          { model: Product, as: "product" },
          { model: PlanVariant, as: "variant" },
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch premium rules: ${error.message}`
      );
    }
  };

  getPremiumRuleById = async (ruleId: string) => {
    try {
      const rule = await MinPremiumRule.findByPk(ruleId, {
        include: [
          { model: Product, as: "product" },
          { model: PlanVariant, as: "variant" },
        ],
      });
      if (!rule)
        throw new NotFoundError(`Premium rule with ID ${ruleId} not found`);
      return rule;
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Failed to fetch premium rule: ${error.message}`);
    }
  };

  getPremiumRulesByProduct = async (productId: string) => {
    try {
      return await MinPremiumRule.findAll({
        where: { product_id: productId },
        include: [
          { model: Product, as: "product" },
          { model: PlanVariant, as: "variant" },
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch premium rules by product: ${error.message}`
      );
    }
  };

  getPremiumRulesByVariant = async (variantId: string) => {
    try {
      return await MinPremiumRule.findAll({
        where: { variant_id: variantId },
        include: [
          { model: Product, as: "product" },
          { model: PlanVariant, as: "variant" },
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch premium rules by variant: ${error.message}`
      );
    }
  };

  updatePremiumRule = async (ruleData: Partial<MinPremiumRuleData>) => {
    try {
      const minprem_id = ruleData.minprem_id;
      const rule = await MinPremiumRule.findByPk(minprem_id);
      if (!rule)
        throw new NotFoundError(`Premium rule with ID ${minprem_id} not found`);
      return await rule.update(ruleData);
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to update premium rule: ${error.message}`
      );
    }
  };

  deletePremiumRule = async (ruleId: string) => {
    try {
      const rule = await MinPremiumRule.findByPk(ruleId);
      if (!rule)
        throw new NotFoundError(`Premium rule with ID ${ruleId} not found`);
      await rule.destroy();
      return { message: "Premium rule deleted successfully" };
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to delete premium rule: ${error.message}`
      );
    }
  };
}

export default PremiumService;
