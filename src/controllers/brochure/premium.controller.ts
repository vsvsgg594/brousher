import { FastifyRequest, FastifyReply } from "fastify";
import { STATUS_CODES } from "../../statuses.utils";
import PremiumService from "../../services/brochure/premium.service";
import { asyncHandler } from "../../utils/function/asyncHandler.function";
import { MinPremiumRuleData } from "../../models/brochure/minPremiumRule.model";

class PremiumController {
  private premiumService: PremiumService;
  constructor() {
    this.premiumService = new PremiumService();
  }

  createPremiumRule = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const premiumRuleData = request.body as MinPremiumRuleData;
      const premiumRule = await this.premiumService.createPremiumRule(
        premiumRuleData
      );
      reply.status(STATUS_CODES.CREATED).send({
        data: premiumRule,
      });
    }
  );

  getAllPremiumRules = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const premiumRules = await this.premiumService.getAllPremiumRules();
      reply.status(STATUS_CODES.OK).send(premiumRules);
    }
  );

  getPremiumRuleById = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const premiumRule = await this.premiumService.getPremiumRuleById(id);
      if (!premiumRule) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: "Premium rule not found",
        });
      }
      reply.status(STATUS_CODES.OK).send(premiumRule);
    }
  );

  getPremiumRulesByProduct = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { productId } = request.params as { productId: string };
      const premiumRules = await this.premiumService.getPremiumRulesByProduct(
        productId
      );
      reply.status(STATUS_CODES.OK).send(premiumRules);
    }
  );

  getPremiumRulesByVariant = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { variantId } = request.params as { variantId: string };
      const premiumRules = await this.premiumService.getPremiumRulesByVariant(
        variantId
      );
      reply.status(STATUS_CODES.OK).send(premiumRules);
    }
  );

  updatePremiumRule = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const ruleData = request.body as Partial<MinPremiumRuleData>;
      const premiumRule = await this.premiumService.updatePremiumRule(ruleData);
      reply.status(STATUS_CODES.OK).send({
        data: premiumRule,
      });
    }
  );

  deletePremiumRule = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { ruleId } = request.query as { ruleId: string };
      const result = await this.premiumService.deletePremiumRule(ruleId);
      reply.status(STATUS_CODES.OK).send({
        message: result.message,
      });
    }
  );
}

export default PremiumController;