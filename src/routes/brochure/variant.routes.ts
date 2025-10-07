import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import VariantController from "../../controllers/brochure/variant.controller";
import {
  validateVariant,
  validateUpdateVariant,
  validateDeleteVariant,
  validateGetVariantById,
  validateGetVariantsByProduct,
  validateVariantSearch,
  validateGetAllVariantsByProductId,
} from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/function/asyncHandler.function";

class VariantRouter {
  private variantController: VariantController;

  constructor() {
    this.variantController = new VariantController();
  }

  async registerRoutes(fastify: FastifyInstance) {
    fastify.post(
      "/variant",
      {
        preHandler: validateVariant,
      },
      asyncHandler(this.variantController.createVariant)
    );

    fastify.get(
      "/variants",
      {
        preHandler: validateVariantSearch,
      },
      asyncHandler(this.variantController.getAllVariants)
    );

    fastify.get(
      "/variant",
      {
        preHandler: validateGetVariantById,
      },
      asyncHandler(this.variantController.getVariantById)
    );

    fastify.get(
      "/variants/product",
      {
        preHandler: validateGetVariantsByProduct,
      },
      asyncHandler(this.variantController.getVariantsByProduct)
    );

    fastify.put(
      "/variant",
      {
        preHandler: validateUpdateVariant,
      },
      asyncHandler(this.variantController.updateVariant)
    );

    fastify.delete(
      "/variant",
      {
        preHandler: validateDeleteVariant,
      },
      asyncHandler(this.variantController.deleteVariant)
    );

    fastify.post(
      "/variants/search",
      {
        preHandler: validateGetAllVariantsByProductId,
      },
      asyncHandler(this.variantController.getAllVariantsByProductId)
    );
  }
}

export default VariantRouter;