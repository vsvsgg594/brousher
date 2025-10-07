import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import AiSummaryController from "../../controllers/brochure/aiSummary.controller";
import { asyncHandler } from "../../utils/function/asyncHandler.function";

class AiSummaryRouter {
  private aiSummaryController: AiSummaryController;

  constructor() {
    this.aiSummaryController = new AiSummaryController();
  }

  async registerRoutes(fastify: FastifyInstance) {
    fastify.post(
      "/aisummary",
      asyncHandler(this.aiSummaryController.generateAiBroucherSummary)
    );

    fastify.post(
      "/save/aisummary",
      asyncHandler(this.aiSummaryController.storeAiBroucherSummary)
    );

    fastify.get(
      "/aisummary",
      asyncHandler(this.aiSummaryController.getAiBroucherSummary)
    );

    fastify.get(
      "/all/aisummary",
      asyncHandler(this.aiSummaryController.getAllAiBroucherSummaries)
    );

    fastify.delete(
      "/aisummary",
      asyncHandler(this.aiSummaryController.deleteAiBroucherSummary)
    );

    fastify.get(
      "/download/aisummary",
      asyncHandler(this.aiSummaryController.downloadAiBroucherSummaryPDF)
    );
  }
}

export default AiSummaryRouter;
