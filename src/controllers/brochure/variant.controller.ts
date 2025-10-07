import { FastifyRequest, FastifyReply } from "fastify";
import { STATUS_CODES } from "../../statuses.utils";
import VariantServicee from "../../services/brochure/variant.service";
import { asyncHandler } from "../../utils/function/asyncHandler.function";
import { PlanVariantData } from "../../models/brochure/planVariant.model";

class VariantController {
  private variantService: VariantServicee;
  constructor() {
    this.variantService = new VariantServicee();
  }

  createVariant = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const variantData = request.body as PlanVariantData;
    const variant = await this.variantService.createVariant(variantData);
    reply.status(STATUS_CODES.CREATED).send(variant);
  });

  getAllVariants = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { search } = request.query as { search?: string };
    const variants = await this.variantService.getAllVariants(String(search));
    reply.status(STATUS_CODES.OK).send(variants);
  });

  getVariantById = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { variantId?: string };
    const variantId = query.variantId;
    const variant = await this.variantService.getVariantById(variantId as string);
    if (!variant) {
      return reply.status(STATUS_CODES.NOT_FOUND).send({
        message: "Variant not found",
      });
    }
    reply.status(STATUS_CODES.OK).send({
      variants: variant,
    });
  });

  getVariantsByProduct = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const { productId } = request.query as { productId: string };
    const variants = await this.variantService.getVariantsByProduct(productId);
    reply.status(STATUS_CODES.OK).send({
      data: variants,
    });
  });

  updateVariant = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    const variantData = request.body as Partial<PlanVariantData> & { eligibility_id?: string };
    const variant = await this.variantService.updateVariant(variantData);
    reply.status(STATUS_CODES.OK).send(variant);
  });

  deleteVariant = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    let { variantId } = request.query as { variantId?: string | string[] };
    if (Array.isArray(variantId)) variantId = variantId[0];
    const result = await this.variantService.deleteVariant(variantId as string);
    reply.status(STATUS_CODES.OK).send({
      message: result.message,
    });
  });

  getAllVariantsByProductId = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { product_id } = request.body as { product_id: string };
      const { page = 1, limit = 10 } = request.query as { page?: number; limit?: number };
      const variants = await this.variantService.getAllVariantsByProductId(
        String(product_id),
        Number(page),
        Number(limit)
      );
      reply.status(STATUS_CODES.OK).send(variants);
    }
  );
}

export default VariantController;