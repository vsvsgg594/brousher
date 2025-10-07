import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import EligibilityController from "../../controllers/brochure/eligibility.controller";
import {
  validateEligibility,
  validateUpdateEligibility,
  validateDeleteEligibility,
  validateGetEligibilityById,
  validateEligibilitySearch,
  validateGetVariantsByEligibility,
  validateGetEligibilityFullData,
} from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/function/asyncHandler.function";

class EligibilityRouter {
  private eligibilityController: EligibilityController;

  constructor() {
    this.eligibilityController = new EligibilityController();
  }

  async registerRoutes(fastify: FastifyInstance) {
    fastify.post(
      "/masters",
      {
        preHandler: validateEligibility,
      },
      asyncHandler(this.eligibilityController.createEligibilityMaster)
    );

    fastify.get(
      "/masters",
      {
        preHandler: validateEligibilitySearch,
      },
      asyncHandler(this.eligibilityController.getAllEligibilityMasters)
    );

    fastify.get(
      "/by-eligibility",
      {
        preHandler: validateGetVariantsByEligibility,
      },
      asyncHandler(this.eligibilityController.getVariantsByEligibility)
    );

    fastify.get(
      "/masters/id",
      {
        preHandler: validateGetEligibilityById,
      },
      asyncHandler(this.eligibilityController.getEligibilityMasterById)
    );

    fastify.put(
      "/masters",
      {
        preHandler: validateUpdateEligibility,
      },
      asyncHandler(this.eligibilityController.updateEligibilityMaster)
    );

    fastify.delete(
      "/masters",
      {
        preHandler: validateDeleteEligibility,
      },
      asyncHandler(this.eligibilityController.deleteEligibilityMaster)
    );

    fastify.get(
      "/masters/relations",
      {
        preHandler: validateGetEligibilityFullData,
      },
      asyncHandler(this.eligibilityController.getAllEligibilityFullData)
    );
  }
}

export default EligibilityRouter;
