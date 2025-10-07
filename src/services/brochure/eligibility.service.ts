import {
  EligibilityMaster,
  EligibilityMasterData,
} from "../../models/brochure/variantEligibility.model";
import { VariantEligibilityLink } from "../../models/brochure/variantEligibilityLink.model";
import { PlanVariant } from "../../models/brochure/planVariant.model";
import { Product } from "../../models/brochure/product.model";
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

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class EligibilityService {
  createEligibilityMaster = async (eligibilityData: EligibilityMasterData) => {
    try {
      return await EligibilityMaster.create({
        eligibility_id: generateUUID(),
        eligibility_name: eligibilityData.eligibility_name,
        insurer: eligibilityData.insurer,
        jurisdiction: eligibilityData.jurisdiction,
        channel: eligibilityData.channel ?? "any",
        pay_type: eligibilityData.pay_type,
        ppt_rule_type: eligibilityData.ppt_rule_type,
        ppt_fixed_years: eligibilityData.ppt_fixed_years,
        ppt_min_years: eligibilityData.ppt_min_years,
        ppt_max_years: eligibilityData.ppt_max_years,
        premium_modes: eligibilityData.premium_modes,
        min_policy_term_type: eligibilityData.min_policy_term_type,
        max_policy_term_type: eligibilityData.max_policy_term_type,
        min_entry_age: eligibilityData.min_entry_age,
        max_entry_age: eligibilityData.max_entry_age,
        min_maturity_age: eligibilityData.min_maturity_age,
        max_maturity_age: eligibilityData.max_maturity_age,
        min_policy_term_value: eligibilityData.min_policy_term_value,
        max_policy_term_value: eligibilityData.max_policy_term_value,
        min_base_sum_assured: eligibilityData.min_base_sum_assured,
        max_base_sum_assured: eligibilityData.max_base_sum_assured,
        currency: eligibilityData.currency,
        effective_from: eligibilityData.effective_from,
        effective_to: eligibilityData.effective_to,
        notes: eligibilityData.notes,
      });
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to create eligibility master: ${error.message}`
      );
    }
  };

  getAllEligibilityMasters = async (search?: string, page = 1, limit = 10) => {
    try {
      const where: any = {};
      if (search && search.trim() !== "") {
        const searchQuery = `%${search.trim()}%`;
        where[Op.or] = [
          { eligibility_name: { [Op.like]: searchQuery } },
          { description: { [Op.like]: searchQuery } },
        ];
      }
      const offset = (page - 1) * limit;
      const { rows, count } = await EligibilityMaster.findAndCountAll({
        where,
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });
      return {
        total: count,
        length: limit,
        eligibilityMasters: rows,
      };
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch eligibility masters: ${error.message}`
      );
    }
  };

  getAllEligibilitInludingVariants = async (
    search?: string,
    page = 1,
    limit = 10
  ) => {
    try {
      const where: any = {};
      if (search && search.trim() !== "") {
        const searchQuery = `%${search.trim()}%`;
        where[Op.or] = [
          { eligibility_name: { [Op.like]: searchQuery } },
          { description: { [Op.like]: searchQuery } },
        ];
      }
      const offset = (page - 1) * limit;
      const { rows, count } = await EligibilityMaster.findAndCountAll({
        where,
        order: [["createdAt", "DESC"]],
        limit,
        offset,
        include: [
          {
            model: PlanVariant,
            as: "variants",
            through: { attributes: [] },
          },
        ],
      });
      return {
        total: count,
        length: limit,
        eligibilityMasters: rows,
      };
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch eligibility masters: ${error.message}`
      );
    }
  };

  getEligibilityMasterById = async (eligibilityId: string) => {
    try {
      const eligibilityMaster = await EligibilityMaster.findByPk(
        eligibilityId,
        {
          include: [
            {
              model: PlanVariant,
              as: "variants",
              through: { attributes: ["override_json", "priority"] },
              include: [
                {
                  model: Product,
                  as: "product",
                  attributes: ["product_id", "product_name", "UIN"],
                },
              ],
            },
          ],
        }
      );
      if (!eligibilityMaster)
        throw new NotFoundError(
          `Eligibility master with ID ${eligibilityId} not found`
        );
      return eligibilityMaster;
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to fetch eligibility master: ${error.message}`
      );
    }
  };

  updateEligibilityMaster = async (
    eligibilityData: Partial<EligibilityMasterData>
  ) => {
    try {
      const eligibility_id = eligibilityData.eligibility_id;
      const eligibilityMaster = await EligibilityMaster.findByPk(
        eligibility_id
      );
      if (!eligibilityMaster)
        throw new NotFoundError(
          `Eligibility master with ID ${eligibility_id} not found`
        );
      return await eligibilityMaster.update(eligibilityData);
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to update eligibility master: ${error.message}`
      );
    }
  };

  deleteEligibilityMaster = async (eligibilityId: string) => {
    try {
      const eligibilityMaster = await EligibilityMaster.findByPk(eligibilityId);
      if (!eligibilityMaster)
        throw new NotFoundError(
          `Eligibility master with ID ${eligibilityId} not found`
        );
      const linksCount = await VariantEligibilityLink.count({
        where: { eligibility_id: eligibilityId },
      });
      if (linksCount > 0) {
        throw new ValidationError(
          `Cannot delete eligibility master. It is linked to ${linksCount} variant(s). Remove links first.`
        );
      }
      await eligibilityMaster.destroy();
      return { message: "Eligibility master deleted successfully" };
    } catch (error: any) {
      if (error instanceof NotFoundError || error instanceof ValidationError)
        throw error;
      throw new DatabaseError(
        `Failed to delete eligibility master: ${error.message}`
      );
    }
  };

  getAllEligibilityFullData = async (search?: string, page = 1, limit = 10) => {
    try {
      const where: any = {};
      if (search && search.trim() !== "") {
        const searchQuery = `%${search.trim()}%`;
        where[Op.or] = [
          { eligibility_name: { [Op.like]: searchQuery } },
          { eligibility_id: { [Op.like]: searchQuery } },
          { jurisdiction: { [Op.like]: searchQuery } },
          { channel: { [Op.like]: searchQuery } },
          { insurer: { [Op.like]: searchQuery } },
        ];
      }
      const offset = (page - 1) * limit;
      const { rows, count } = await EligibilityMaster.findAndCountAll({
        where,
        include: [
          {
            model: PlanVariant,
            as: "variants",
            through: { attributes: [] },
            include: [
              {
                model: Product,
                as: "product",
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });
      return {
        total: count,
        length: limit,
        eligibilityRelation: rows,
      };
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch all eligibility full data: ${error.message}`
      );
    }
  };

  // linkVariantToEligibility = async (linkData: VariantEligibilityLinkData) => {
  //   try {
  //     const variant = await PlanVariant.findByPk(linkData.variant_id);
  //     if (!variant) throw new NotFoundError(`Variant with ID ${linkData.variant_id} not found`);
  //     const eligibility = await EligibilityMaster.findByPk(linkData.eligibility_id);
  //     if (!eligibility) throw new NotFoundError(`Eligibility with ID ${linkData.eligibility_id} not found`);
  //     const existingLink = await VariantEligibilityLink.findOne({
  //       where: {
  //         variant_id: linkData.variant_id,
  //         eligibility_id: linkData.eligibility_id,
  //         effective_to: null
  //       }
  //     });
  //     if (existingLink) {
  //       throw new ValidationError('Variant is already linked to this eligibility');
  //     }
  //     return await VariantEligibilityLink.create(linkData);
  //   } catch (error: any) {
  //     if (error instanceof NotFoundError || error instanceof ValidationError) throw error;
  //     throw new DatabaseError(`Failed to link variant to eligibility: ${error.message}`);
  //   }
  // };

  // unlinkVariantFromEligibility = async (linkId: string) => {
  //   try {
  //     const link = await VariantEligibilityLink.findByPk(linkId);
  //     if (!link) throw new NotFoundError(`Eligibility link with ID ${linkId} not found`);
  //     await link.destroy();
  //     return { message: "Variant eligibility link removed successfully" };
  //   } catch (error: any) {
  //     if (error instanceof NotFoundError) throw error;
  //     throw new DatabaseError(`Failed to unlink variant from eligibility: ${error.message}`);
  //   }
  // };

  // updateVariantEligibilityLink = async (linkData: Partial<VariantEligibilityLinkData>) => {
  //   try {
  //     const link_id = linkData.link_id;
  //     const link = await VariantEligibilityLink.findByPk(link_id);
  //     if (!link) throw new NotFoundError(`Eligibility link with ID ${link_id} not found`);
  //     return await link.update(linkData);
  //   } catch (error: any) {
  //     if (error instanceof NotFoundError) throw error;
  //     throw new DatabaseError(`Failed to update variant eligibility link: ${error.message}`);
  //   }
  // };
}

export default EligibilityService;
