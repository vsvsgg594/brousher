import {
  PlanVariant,
  PlanVariantData,
} from "../../models/brochure/planVariant.model";
import { Product } from "../../models/brochure/product.model";
import { EligibilityMaster } from "../../models/brochure/variantEligibility.model";
import { VariantEligibilityLink } from "../../models/brochure/variantEligibilityLink.model";
import { MinPremiumRule } from "../../models/brochure/minPremiumRule.model";
import sequelize from "../../utils/config.utils";
import { Op } from "sequelize";
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

class VariantService {
  createVariant = async (
    variantData: PlanVariantData & { eligibility_id?: string }
  ) => {
    const transaction = await sequelize.transaction();
    try {
      const variant = await PlanVariant.create(
        {
          variant_id: generateUUID(),
          product_id: variantData.product_id,
          variant_code: variantData.variant_code,
          variant_label: variantData.variant_label,
          variant_description: variantData.variant_description,
          effective_from: variantData.effective_from,
          effective_to: variantData.effective_to,
          notes: variantData.variant_description
        },
        { transaction }
      );
      if (variantData.eligibility_id?.length) {
        const eligibilityIds = variantData.eligibility_id
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id);
        for (const eligibility_id of eligibilityIds) {
          await VariantEligibilityLink.create(
            {
              variant_id: variant.variant_id,
              eligibility_id,
              effective_from: new Date(),
              priority: 1,
            },
            { transaction }
          );
        }
      }
      await transaction.commit();
      return variant;
    } catch (error: any) {
      await transaction.rollback();
      throw new DatabaseError(`Failed to create variant: ${error.message}`);
    }
  };

  getAllVariants = async (search?: string) => {
    try {
      const whereClause: any = {};
      if (search && search.trim() !== "") {
        const searchQuery = `%${search.trim()}%`;
        whereClause[Op.or] = [
          { variant_id: { [Op.like]: searchQuery } },
          { product_id: { [Op.like]: searchQuery } },
          { variant_code: { [Op.like]: searchQuery } },
          { variant_label: { [Op.like]: searchQuery } },
        ];
      }
      const variants = await PlanVariant.findAll({
        where: whereClause,
        include: [
          {
            model: Product,
            as: "product",
          },
          {
            model: VariantEligibilityLink,
            as: "eligibilityLinks",
            include: [
              {
                model: EligibilityMaster,
                as: "eligibility",
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      const transformedVariants = variants.map((variant) =>
        this.transformVariantData(variant)
      );
      return {
        total: await PlanVariant.count({ where: whereClause }),
        length: variants.length,
        variants: transformedVariants,
      };
    } catch (error: any) {
      throw new DatabaseError(`Failed to fetch variants: ${error.message}`);
    }
  };

  getVariantById = async (variantId: string) => {
    try {
      const variant = await PlanVariant.findByPk(variantId, {
        include: [
          {
            model: Product,
            as: "product",
          },
          {
            model: VariantEligibilityLink,
            as: "eligibilityLinks",
            include: [
              {
                model: EligibilityMaster,
                as: "eligibility",
              },
            ],
          },
          // {
          //   model: MinPremiumRule,
          //   as: "premiumRules",
          // },
        ],
      });
      if (!variant)
        throw new NotFoundError(`Variant with ID ${variantId} not found`);
      return this.transformVariantData(variant);
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Failed to fetch variant: ${error.message}`);
    }
  };

  getVariantsByProduct = async (productId: string) => {
    try {
      const variants = await PlanVariant.findAll({
        where: { product_id: productId },
        include: [
          {
            model: Product,
            as: "product",
          },
          {
            model: VariantEligibilityLink,
            as: "eligibilityLinks",
            include: [
              {
                model: EligibilityMaster,
                as: "eligibility",
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      const transformedVariants = variants.map((variant) =>
        this.transformVariantData(variant)
      );
      return transformedVariants;
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch variants by product: ${error.message}`
      );
    }
  };

  updateVariant = async (
    variantData: Partial<PlanVariantData> & { eligibility_id?: string }
  ) => {
    const transaction = await sequelize.transaction();
    try {
      const variant_id = variantData.variant_id;
      const variant = await PlanVariant.findByPk(variant_id);
      if (!variant)
        throw new NotFoundError(`Variant with ID ${variant_id} not found`);
      await variant.update(variantData, { transaction });
      if (variantData.eligibility_id !== undefined) {
        await VariantEligibilityLink.destroy({
          where: { variant_id },
          transaction,
        });
        if (variantData.eligibility_id?.length) {
          const eligibilityIds = variantData.eligibility_id
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id);
          for (const eligibility_id of eligibilityIds) {
            await VariantEligibilityLink.create(
              {
                variant_id: variant.variant_id,
                eligibility_id,
                effective_from: new Date(),
                priority: 1,
              },
              { transaction }
            );
          }
        }
      }
      await transaction.commit();
      const updatedVariant = await PlanVariant.findByPk(variant_id, {
        include: [
          {
            model: Product,
            as: "product",
          },
          {
            model: VariantEligibilityLink,
            as: "eligibilityLinks",
            include: [
              {
                model: EligibilityMaster,
                as: "eligibility",
              },
            ],
          },
        ],
      });
      return this.transformVariantData(updatedVariant);
    } catch (error: any) {
      await transaction.rollback();
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Failed to update variant: ${error.message}`);
    }
  };

  deleteVariant = async (variantId: string) => {
    const transaction = await sequelize.transaction();
    try {
      const variant = await PlanVariant.findByPk(variantId, { transaction });
      if (!variant)
        throw new NotFoundError(`Variant with ID ${variantId} not found`);
      await VariantEligibilityLink.destroy({
        where: { variant_id: variantId },
        transaction,
      });
      await MinPremiumRule.destroy({
        where: { variant_id: variantId },
        transaction,
      });
      await variant.destroy({ transaction });
      await transaction.commit();
      return { message: "Variant and all related data deleted successfully" };
    } catch (error: any) {
      await transaction.rollback();
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Failed to delete variant: ${error.message}`);
    }
  };

  getAllVariantsByProductId = async (
    product_id: string,
    page: number = 1,
    limit: number = 10
  ) => {
    try {
      const where: any = { product_id };
      const offset = (page - 1) * limit;
      const total = await PlanVariant.count({ where });
      const variants = await PlanVariant.findAll({
        where,
        include: [
          {
            model: VariantEligibilityLink,
            as: "eligibilityLinks",
            include: [
              {
                model: EligibilityMaster,
                as: "eligibility",
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        offset,
        limit,
      });
      const transformedVariants = variants.map((variant) =>
        this.transformVariantData(variant)
      );
      return {
        total,
        length: limit,
        variants: transformedVariants,
      };
    } catch (error: any) {
      throw new DatabaseError(`Failed to fetch variants: ${error.message}`);
    }
  };

  private transformVariantData = (
    variant: any,
    resolveOverrides: boolean = false
  ) => {
    const transformedVariant = JSON.parse(JSON.stringify(variant));
    if (transformedVariant.eligibilityLinks) {
      transformedVariant.eligibilityRules =
        transformedVariant.eligibilityLinks.map((link: any) => {
          if (resolveOverrides && link.override_json) {
            return {
              ...link.eligibility,
              ...link.override_json,
              link_id: link.link_id,
              override_applied: true,
              priority: link.priority,
              effective_from: link.effective_from,
              effective_to: link.effective_to,
            };
          } else {
            return {
              ...link.eligibility,
              link_id: link.link_id,
              override_json: link.override_json,
              priority: link.priority,
              effective_from: link.effective_from,
              effective_to: link.effective_to,
            };
          }
        });
      delete transformedVariant.eligibilityLinks;
    }
    return transformedVariant;
  };
}

export default VariantService;
