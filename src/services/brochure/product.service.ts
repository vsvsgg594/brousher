import { Product, ProductData } from "../../models/brochure/product.model";
import {
  PlanVariant,
  PlanVariantData,
} from "../../models/brochure/planVariant.model";
import {
  MinPremiumRule,
  MinPremiumRuleData,
} from "../../models/brochure/minPremiumRule.model";
import { EligibilityMaster } from "../../models/brochure/variantEligibility.model";
import { VariantEligibilityLink } from "../../models/brochure/variantEligibilityLink.model";
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

class ProductService {
  createProduct = async (productData: ProductData) => {
    try {
      return await Product.create({
        product_id: generateUUID(),
        UIN: productData.UIN,
        product_name: productData.product_name,
        insurer: productData.insurer,
        jurisdiction: productData.jurisdiction,
        currency: productData.currency,
        product_tagline: productData.product_tagline,
        product_version: productData.product_version,
        effective_from: productData.effective_from,
        effective_to: productData.effective_to,
        notes: productData.notes,
      });
    } catch (error: any) {
      throw new DatabaseError(`Failed to create product: ${error.message}`);
    }
  };

  getCompleteProduct = async (productId: string) => {
    try {
      const product = await Product.findByPk(productId, {
        include: [
          {
            model: PlanVariant,
            as: "variants",
            include: [
              {
                model: VariantEligibilityLink,
                as: "eligibilityLinks",
                include: [
                  {
                    model: EligibilityMaster,
                    as: "eligibility",
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                  },
                ],
              },
              {
                model: MinPremiumRule,
                as: "premiumRules",
              },
            ],
          },
          {
            model: MinPremiumRule,
            as: "premiumRules",
            where: { variant_id: null },
            required: false,
          },
        ],
      });
      if (!product)
        throw new NotFoundError(`Product with ID ${productId} not found`);
      return this.transformProductData(product);
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to fetch complete product: ${error.message}`
      );
    }
  };

  getAllProducts = async (search?: string) => {
    try {
      const whereClause: any = {};
      if (search && search.trim() !== "") {
        const searchQuery = `%${search.trim()}%`;
        whereClause[Op.or] = [
          { product_id: { [Op.like]: searchQuery } },
          { UIN: { [Op.like]: searchQuery } },
          { product_name: { [Op.like]: searchQuery } },
          { insurer: { [Op.like]: searchQuery } },
        ];
      }
      const total = await Product.count({ where: whereClause });
      const products = await Product.findAll({
        where: whereClause,
        order: [["createdAt", "DESC"]],
      });
      return {
        total,
        length: products.length,
        products,
      };
    } catch (error: any) {
      throw new DatabaseError(`Failed to fetch products: ${error.message}`);
    }
  };

  getProductById = async (productId: string) => {
    try {
      const product = await Product.findByPk(productId);
      if (!product)
        throw new NotFoundError(`Product with ID ${productId} not found`);
      return product;
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Failed to fetch product: ${error.message}`);
    }
  };

  updateProduct = async (
    productData: Partial<ProductData> & { product_id?: string }
  ) => {
    try {
      const product_id = productData.product_id;
      const product = await Product.findByPk(product_id);
      if (!product)
        throw new NotFoundError(`Product with ID ${product_id} not found`);
      return await product.update(productData);
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Failed to update product: ${error.message}`);
    }
  };

  deleteProduct = async (productId: string) => {
    const transaction = await sequelize.transaction();
    try {
      const product = await Product.findByPk(productId, { transaction });
      if (!product)
        throw new NotFoundError(`Product with ID ${productId} not found`);
      const variants = await PlanVariant.findAll({
        where: { product_id: productId },
        transaction,
      });
      const variantIds = variants.map((v) => v.variant_id);
      if (variantIds.length > 0) {
        await VariantEligibilityLink.destroy({
          where: { variant_id: variantIds },
          transaction,
        });
      }
      await PlanVariant.destroy({
        where: { product_id: productId },
        transaction,
      });
      await MinPremiumRule.destroy({
        where: { product_id: productId },
        transaction,
      });
      await product.destroy({ transaction });
      await transaction.commit();
      return { message: "Product and all related data deleted successfully" };
    } catch (error: any) {
      await transaction.rollback();
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Failed to delete product: ${error.message}`);
    }
  };

  getAllProductsSearch = async (
    search?: string,
    page: number = 1,
    limit: number = 10
  ) => {
    try {
      const where: any = {};
      if (search) {
        where[Op.or] = [
          { product_name: { [Op.like]: `%${search}%` } },
          { insurer: { [Op.like]: `%${search}%` } },
          { UIN: { [Op.like]: `%${search}%` } },
        ];
      }
      const offset = (page - 1) * limit;
      const total = await Product.count({ where });
      const products = await Product.findAll({
        where,
        order: [["createdAt", "DESC"]],
        offset,
        limit,
      });
      return {
        total,
        length: limit,
        data: products,
      };
    } catch (error: any) {
      throw new DatabaseError(`Failed to fetch products: ${error.message}`);
    }
  };

  private transformProductData = (product: any) => {
    const transformedProduct = JSON.parse(JSON.stringify(product));
    if (transformedProduct.variants) {
      transformedProduct.variants = transformedProduct.variants.map(
        (variant: any) => {
          if (variant.eligibilityLinks) {
            variant.eligibilityRules = variant.eligibilityLinks.map(
              (link: any) => {
                const eligibilityData = {
                  ...link.eligibility,
                  link_id: link.link_id,
                  override_json: link.override_json,
                  priority: link.priority,
                  effective_from: link.effective_from,
                  effective_to: link.effective_to,
                };
                if (link.override_json) {
                  Object.keys(link.override_json).forEach((key) => {
                    if (link.override_json[key] !== undefined) {
                      eligibilityData[key] = link.override_json[key];
                    }
                  });
                }
                return eligibilityData;
              }
            );
            delete variant.eligibilityLinks;
          }
          return variant;
        }
      );
    }
    return transformedProduct;
  };

  getProductWithResolvedEligibility = async (productId: string) => {
    try {
      const product = await Product.findByPk(productId, {
        include: [
          {
            model: PlanVariant,
            as: "variants",
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
                where: {
                  [Op.or]: [
                    { effective_to: null },
                    { effective_to: { [Op.gte]: new Date() } },
                  ],
                },
                required: false,
              },
              {
                model: MinPremiumRule,
                as: "premiumRules",
              },
            ],
          },
        ],
      });
      if (!product)
        throw new NotFoundError(`Product with ID ${productId} not found`);
      return this.transformProductData(product);
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to fetch product with resolved eligibility: ${error.message}`
      );
    }
  };

  getProductsByEligibilityCriteria = async (criteria: {
    jurisdiction?: string;
    insurer?: string;
    channel?: string;
    pay_type?: string;
    min_entry_age?: number;
    max_entry_age?: number;
  }) => {
    try {
      const whereClause: any = {};

      if (criteria.jurisdiction) {
        whereClause.jurisdiction = criteria.jurisdiction;
      }
      if (criteria.insurer) {
        whereClause.insurer = criteria.insurer;
      }
      const products = await Product.findAll({
        where: whereClause,
        include: [
          {
            model: PlanVariant,
            as: "variants",
            include: [
              {
                model: VariantEligibilityLink,
                as: "eligibilityLinks",
                include: [
                  {
                    model: EligibilityMaster,
                    as: "eligibility",
                    where: {
                      ...(criteria.channel && { channel: criteria.channel }),
                      ...(criteria.pay_type && { pay_type: criteria.pay_type }),
                      ...(criteria.min_entry_age && {
                        min_entry_age: { [Op.lte]: criteria.min_entry_age },
                      }),
                      ...(criteria.max_entry_age && {
                        max_entry_age: { [Op.gte]: criteria.max_entry_age },
                      }),
                    },
                  },
                ],
                required: false,
              },
            ],
          },
        ],
      });
      return products;
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch products by eligibility criteria: ${error.message}`
      );
    }
  };

  createCompleteBrochure = async (data: {
    productData: ProductData;
    variantsData: Array<{
      variant: PlanVariantData & { eligibility_ids?: string };
      premiumRules: MinPremiumRuleData[];
      linkData?: any;
    }>;
  }) => {
    const transaction = await sequelize.transaction();
    try {
      const product = await Product.create(
        { product_id: generateUUID(), ...data.productData },
        { transaction }
      );
      const createdVariants = await Promise.all(
        data.variantsData.map(async (variantData) => {
          const variant = await PlanVariant.create(
            {
              variant_id: generateUUID(),
              ...variantData.variant,
              product_id: product.product_id,
            },
            { transaction }
          );
          let eligibilityLinks: VariantEligibilityLink[] = [];
          if (variantData.variant.eligibility_ids) {
            const ids = variantData.variant.eligibility_ids
              .split(",")
              .map((id) => id.trim())
              .filter((id) => id.length > 0);
            eligibilityLinks = await Promise.all(
              ids.map(async (eid, index) => {
                const eligibilityMaster = await EligibilityMaster.findByPk(
                  eid,
                  {
                    transaction,
                  }
                );
                if (!eligibilityMaster) {
                  throw new NotFoundError(
                    `Eligibility master not found: ${eid}`
                  );
                }
                return await VariantEligibilityLink.create(
                  {
                    variant_id: variant.variant_id,
                    eligibility_id: eligibilityMaster.eligibility_id,
                    priority: variantData.linkData?.priority || index + 1,
                    override_json: variantData.linkData?.override_json || {},
                    effective_from:
                      variantData.linkData?.effective_from || new Date(),
                    notes: variantData.linkData?.notes,
                  },
                  { transaction }
                );
              })
            );
          }
          const premiumRules = await Promise.all(
            variantData.premiumRules.map((ruleData) =>
              MinPremiumRule.create(
                {
                  minprem_id: generateUUID(),
                  ...ruleData,
                  product_id: product.product_id,
                  variant_id: variant.variant_id,
                },
                { transaction }
              )
            )
          );
          return {
            variant,
            eligibilityLinks,
            premiumRules,
          };
        })
      );
      await transaction.commit();
      return { product, variants: createdVariants };
    } catch (error: any) {
      await transaction.rollback();
      throw new DatabaseError(
        `Failed to create complete brochure: ${error.message}`
      );
    }
  };

  getCompleteBrochureData = async () => {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: PlanVariant,
            as: "variants",
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
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      const transformedProducts = products.map((product) =>
        this.transformProductData(product)
      );
      return {
        products: transformedProducts,
      };
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch complete brochure data: ${error.message}`
      );
    }
  };

  getCompleteSingleBrochureData = async (productId: string) => {
    try {
      const products = await Product.findAll({
        where: { product_id: productId },
        include: [
          {
            model: PlanVariant,
            as: "variants",
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
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (!products || products.length === 0) {
        throw new DatabaseError(`No product found with ID: ${productId}`);
      }
      const transformedProducts = products.map((product) =>
        this.transformProductData(product)
      );
      const firstProduct = transformedProducts[0];
      if (!firstProduct.variants || !Array.isArray(firstProduct.variants)) {
        return {
          products: transformedProducts,
          variants: [],
          eligibilityRules: [],
        };
      }
      const allEligibilityRules = transformedProducts[0].variants.flatMap(
        (v: { eligibilityRules: any }) => v.eligibilityRules
      );
      return {
        products: transformedProducts,
        variants: firstProduct.variants,
        eligibilityRules: allEligibilityRules,
      };
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch complete brochure data: ${error.message}`
      );
    }
  };
}

export default ProductService;
