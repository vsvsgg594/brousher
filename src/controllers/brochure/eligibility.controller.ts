import { FastifyRequest, FastifyReply } from "fastify";
import { STATUS_CODES } from "../../statuses.utils";
import EligibilityService from "../../services/brochure/eligibility.service";
import { asyncHandler } from "../../utils/function/asyncHandler.function";
import { EligibilityMasterData } from "../../models/brochure/variantEligibility.model";

class EligibilityController {
  private eligibilityService: EligibilityService;

  constructor() {
    this.eligibilityService = new EligibilityService();
  }

  createEligibilityMaster = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as any;
      if ("eligibility_id" in body) delete body.eligibility_id;
      if ("createdAt" in body) delete body.createdAt;
      if ("updatedAt" in body) delete body.updatedAt;
      const eligibilityData = body as EligibilityMasterData;
      const eligibility = await this.eligibilityService.createEligibilityMaster(
        eligibilityData
      );
      reply.status(STATUS_CODES.CREATED).send(eligibility);
    }
  );

  getAllEligibilityMasters = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const {
        search,
        page = "1",
        limit = "10",
      } = request.query as {
        search?: string;
        page?: string;
        limit?: string;
      };
      const result = await this.eligibilityService.getAllEligibilityMasters(
        search as string,
        Number(page),
        Number(limit)
      );
      reply.status(STATUS_CODES.OK).send(result);
    }
  );

  getVariantsByEligibility = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const variants =
        await this.eligibilityService.getAllEligibilitInludingVariants();
      reply.status(STATUS_CODES.OK).send(variants);
    }
  );

  getEligibilityMasterById = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { eligibilityId } = request.query as { eligibilityId: string };
      const eligibility =
        await this.eligibilityService.getEligibilityMasterById(eligibilityId);
      reply.status(STATUS_CODES.OK).send(eligibility);
    }
  );

  updateEligibilityMaster = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const eligibilityData = request.body as Partial<EligibilityMasterData>;
      const eligibility = await this.eligibilityService.updateEligibilityMaster(
        eligibilityData
      );
      reply.status(STATUS_CODES.OK).send(eligibility);
    }
  );

  deleteEligibilityMaster = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { eligibilityId } = request.query as { eligibilityId: string };
      const result = await this.eligibilityService.deleteEligibilityMaster(
        eligibilityId
      );
      reply.status(STATUS_CODES.OK).send({
        success: true,
        message: result.message,
      });
    }
  );

  getAllEligibilityFullData = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const {
        search,
        page = "1",
        limit = "10",
      } = request.query as {
        search?: string;
        page?: string;
        limit?: string;
      };
      const result = await this.eligibilityService.getAllEligibilityFullData(
        search as string,
        Number(page),
        Number(limit)
      );
      reply.status(STATUS_CODES.OK).send(result);
    }
  );

  // linkVariantToEligibility = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  //   const linkData = request.body as VariantEligibilityLinkData;
  //   const link = await this.eligibilityService.linkVariantToEligibility(linkData);
  //   reply.status(STATUS_CODES.CREATED).send({
  //     success: true,
  //     data: link,
  //     message: "Variant linked to eligibility successfully"
  //   });
  // });

  // unlinkVariantFromEligibility = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  //   const { linkId } = request.query as { linkId: string };
  //   const result = await this.eligibilityService.unlinkVariantFromEligibility(linkId);
  //   reply.status(STATUS_CODES.OK).send({
  //     success: true,
  //     message: result.message
  //   });
  // });

  // updateVariantEligibilityLink = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
  //   const linkData = request.body as Partial<VariantEligibilityLinkData>;
  //   const link = await this.eligibilityService.updateVariantEligibilityLink(linkData);
  //   reply.status(STATUS_CODES.OK).send({
  //     success: true,
  //     data: link,
  //     message: "Variant eligibility link updated successfully"
  //   });
  // });
}

export default EligibilityController;
