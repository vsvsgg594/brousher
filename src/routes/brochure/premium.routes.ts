// ----------------------------------------------------- Note -----------------------------------------------
// currently we are not using this
// -----------------------------------------------
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import PremiumController from "../../controllers/brochure/premium.controller";
import {
  validatePremiumRule,
  validateUpdatePremiumRule,
  validateDeletePremiumRule,
  validateGetPremiumRuleById,
  validateGetPremiumRulesByProduct,
  validateGetPremiumRulesByVariant,
} from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/function/asyncHandler.function";

class PremiumRuleRouter {
  private premiumController: PremiumController;

  constructor() {
    this.premiumController = new PremiumController();
  }

  async registerRoutes(fastify: FastifyInstance) {
    fastify.post(
      "/premium-rule",
      {
        preHandler: validatePremiumRule,
      },
      asyncHandler(this.premiumController.createPremiumRule)
    );

    fastify.get(
      "/premium-rules",
      asyncHandler(this.premiumController.getAllPremiumRules)
    );

    fastify.get(
      "/premium-rule/:id",
      {
        preHandler: validateGetPremiumRuleById,
      },
      asyncHandler(this.premiumController.getPremiumRuleById)
    );

    fastify.get(
      "/premium-rules/product/:productId",
      {
        preHandler: validateGetPremiumRulesByProduct,
      },
      asyncHandler(this.premiumController.getPremiumRulesByProduct)
    );

    fastify.get(
      "/premium-rules/variant/:variantId",
      {
        preHandler: validateGetPremiumRulesByVariant,
      },
      asyncHandler(this.premiumController.getPremiumRulesByVariant)
    );

    fastify.put(
      "/premium-rule",
      {
        preHandler: validateUpdatePremiumRule,
      },
      asyncHandler(this.premiumController.updatePremiumRule)
    );

    fastify.delete(
      "/premium-rule",
      {
        preHandler: validateDeletePremiumRule,
      },
      asyncHandler(this.premiumController.deletePremiumRule)
    );
  }
}

export default PremiumRuleRouter;
