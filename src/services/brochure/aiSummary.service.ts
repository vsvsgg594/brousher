import { Product, ProductData } from "../../models/brochure/product.model";
import { PlanVariantDataforAI } from "../../models/brochure/planVariant.model";
import {
  BrochureSummary,
  BrochureSummaryData,
} from "../../models/brochure/aiBrochuresSummary.model";
import { eligibilityPrompt } from "../../prompts/product.prompt";
import { runOpenAI } from "../openai.service";
import { generateUUID } from "../../utils/constants.utils";
import PDFGenerator from "../../utils/pdfGenerator.utils";

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

class AiSummaryService {
    private pdfGenerator: PDFGenerator;

  constructor() {
    this.pdfGenerator = new PDFGenerator();
  }
  
  generateAiBroucherSummary = async (data: {
    product: ProductData[];
    variants: PlanVariantDataforAI[];
  }) => {
    try {
      const transformedData = this.transformForAIPrompt(data);
      const prompt = eligibilityPrompt(
        transformedData.product,
        transformedData.variants
      );
      const response = await runOpenAI({
        prompt,
        format: "json",
      });
      return response;
    } catch (error: any) {
      console.error("Error in generateAiBrochureSummary:", error.message);
      throw error;
    }
  };

  storeAiBroucherSummary = async (summaryData: BrochureSummaryData) => {
    try {
      const [summary, created] = await BrochureSummary.findOrCreate({
        where: { product_id: summaryData.product_id },
        defaults: {
          summary_id: generateUUID(),
          ...summaryData,
        },
      });
      if (!created) await summary.update(summaryData);
      return {
        message: created
          ? "Brochure summary created successfully"
          : "Brochure summary updated successfully",
        summary,
      };
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to upsert brochure summary: ${error.message}`
      );
    }
  };

  getAllAiBroucherSummaries = async () => {
    try {
      const summaries = await BrochureSummary.findAll({
        include: [
          {
            model: Product,
            as: "product",
          },
        ],
      });
      return {
        success: true,
        message: "Brochure summaries fetched successfully",
        summaries,
      };
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch brochure summaries: ${error.message}`
      );
    }
  };

  getAiBrochureSummary = async (productId: string) => {
    try {
      const summary = await BrochureSummary.findOne({
        where: { product_id: productId },
        include: [
          {
            model: Product,
            as: "product",
          },
        ],
      });
      return {
        message: "Brochure summary fetched successfully",
        summary,
      };
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch brochure summary: ${error.message}`
      );
    }
  };

  deleteAiBroucherSummary = async (productId: string) => {
    try {
      const deletedCount = await BrochureSummary.destroy({
        where: { product_id: productId },
      });
      if (!deletedCount)
        return { message: "No brochure summary found to delete" };
      return {
        success: true,
        message: "Brochure summary deleted successfully",
      };
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to delete brochure summary: ${error.message}`
      );
    }
  };

  private transformForAIPrompt = (product: any) => {
    const transformedProduct = JSON.parse(JSON.stringify(product));
    const eligibilities: any[] = [];
    const variants: any[] = [];
    if (transformedProduct.variants) {
      transformedProduct.variants.forEach((variant: any) => {
        variants.push({
          ...variant,
          eligibilityRules: undefined,
        });
        if (variant.eligibilityLinks) {
          variant.eligibilityLinks.forEach((link: any) => {
            const eligibility = {
              ...link.eligibility,
              variant_id: variant.variant_id,
              ...(link.override_json || {}),
            };
            eligibilities.push(eligibility);
          });
        }
      });
      transformedProduct.variants = transformedProduct.variants.map(
        (variant: any) => {
          const { eligibilityLinks, ...cleanVariant } = variant;
          return cleanVariant;
        }
      );
    }
    return {
      product: transformedProduct,
      variants: variants,
      eligibilities: eligibilities,
    };
  };

  getAiBrochureSummaryById = async (summaryId: string) => {
    try {
      const summary = await BrochureSummary.findOne({
        where: { summary_id: summaryId },
        include: [
          {
            model: Product,
            as: "product",
          },
        ],
      });
      if (!summary) {
        throw new NotFoundError("Brochure summary not found");
      }
      return {
        success: true,
        message: "Brochure summary fetched successfully",
        summary: summary.toJSON(),
      };
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to fetch brochure summary: ${error.message}`
      );
    }
  };

  generateSummaryPDF = async (summaryId: string): Promise<Buffer> => {
    try {
      const result = await this.getAiBrochureSummaryById(summaryId);
      const summary = result.summary;
      const pdfBuffer = await this.pdfGenerator.generatePDF(summary);
      return pdfBuffer;
    } catch (error: any) {
      console.error("Error in generateSummaryPDF:", error.message);
      throw new DatabaseError(`Failed to generate PDF: ${error.message}`);
    }
  };
}

export default AiSummaryService;
