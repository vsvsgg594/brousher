import { FastifyRequest, FastifyReply } from "fastify";
import { STATUS_CODES } from "../../statuses.utils";
import AiSummaryService from "../../services/brochure/aiSummary.service";
import { asyncHandler } from "../../utils/function/asyncHandler.function";
import { Product } from "../../models/brochure/product.model";
import { PlanVariant } from "../../models/brochure/planVariant.model";
import { EligibilityMaster } from "../../models/brochure/variantEligibility.model";
import { BrochureSummaryData } from "../../models/brochure/aiBrochuresSummary.model";

class AiSummaryController {
  private aiSummaryService: AiSummaryService;

  constructor() {
    this.aiSummaryService = new AiSummaryService();
  }

  generateAiBroucherSummary = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { productID } = request.body as { productID: string };
      if (!productID) {
        return reply.status(400).send({
          success: false,
          message: "productID is required",
        });
      }
      const [product, variants] = await Promise.all([
        Product.findByPk(productID),
        PlanVariant.findAll({
          where: { product_id: productID },
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: EligibilityMaster,
              as: "eligibilities",
            },
          ],
        }),
      ]);
      if (!product || !variants || variants.length === 0) {
        return reply.status(404).send({
          success: false,
          message: "Invalid product or no variants found",
        });
      }
      const normalize = (data: any) =>
        Array.isArray(data)
          ? data.map((d) => (d?.toJSON ? d.toJSON() : d))
          : data?.toJSON
          ? data.toJSON()
          : data;
      const normProduct = normalize(product);
      const normVariants = normalize(variants);
      const message = await this.aiSummaryService.generateAiBroucherSummary({
        product: normProduct,
        variants: normVariants,
      });
      return reply.status(200).send({
        success: true,
        summary: message,
      });
    }
  );

  storeAiBroucherSummary = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { summary } = request.body as { summary: any };
      const summaryData: BrochureSummaryData = {
        product_id: summary.product_glance.product_id,
        product_name: summary.product_glance.product_name,
        product_code: summary.product_glance.product_code,
        insurer: summary.product_glance.insurer,
        description: summary.product_glance.product_tagline,
        effective_from: new Date(summary.product_glance.effective_from),
        effective_to: summary.product_glance.effective_to
          ? new Date(summary.product_glance.effective_to)
          : undefined,
        variants: summary.variants,
        eligibility_snapshot: summary.eligibility_snapshot,
        notes: summary.notes,
      };
      const data = await this.aiSummaryService.storeAiBroucherSummary(
        summaryData
      );
      reply.status(STATUS_CODES.CREATED).send(data);
    }
  );

  getAllAiBroucherSummaries = asyncHandler(
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const data = await this.aiSummaryService.getAllAiBroucherSummaries();
      reply.status(STATUS_CODES.OK).send(data);
    }
  );

  getAiBroucherSummary = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = request.query as { productId?: string };
      const productId = query.productId;
      console.log("PRODUCT ID", productId);
      const data = await this.aiSummaryService.getAiBrochureSummary(
        String(productId)
      );
      reply.status(STATUS_CODES.OK).send(data);
    }
  );

  deleteAiBroucherSummary = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as { productId?: string };
      const query = request.query as { productId?: string };
      const productId = body.productId || query.productId;
      const data = await this.aiSummaryService.deleteAiBroucherSummary(
        String(productId)
      );
      reply.status(STATUS_CODES.OK).send(data);
    }
  );

  downloadAiBroucherSummaryPDF = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { summaryId } = request.query as { summaryId: string };
      const pdfBuffer = await this.aiSummaryService.generateSummaryPDF(
        summaryId
      );
      reply.header("Content-Type", "application/pdf");
      reply.header(
        "Content-Disposition",
        `attachment; filename="insurance-summary-${summaryId}.pdf"`
      );
      reply.header("Content-Length", pdfBuffer.length.toString());
      reply.send(pdfBuffer);
    }
  );
}

export default AiSummaryController;
