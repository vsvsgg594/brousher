import { FastifyRequest, FastifyReply } from "fastify";
import { STATUS_CODES } from "../../statuses.utils";
import { asyncHandler } from "../../utils/function/asyncHandler.function";
import { ProductData } from "../../models/brochure/product.model";
import ProductService from "../../services/brochure/product.service";
import { PlanVariantData } from "../../models/brochure/planVariant.model";
import { EligibilityMasterData } from "../../models/brochure/variantEligibility.model";
import { MinPremiumRuleData } from "../../models/brochure/minPremiumRule.model";

class ProductController {
  private productService: ProductService;
  constructor() {
    this.productService = new ProductService();
  }

  createProduct = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const productData = request.body as ProductData;
      const product = await this.productService.createProduct(productData);
      reply.status(STATUS_CODES.CREATED).send({
        data: product,
      });
    }
  );

  getAllProducts = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { search } = request.query as { search?: string };
      const products = await this.productService.getAllProducts(String(search));
      reply.status(STATUS_CODES.OK).send(products);
    }
  );

  getProductById = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { productId } = request.query as { productId: string };
      const product = await this.productService.getProductById(productId);
      if (!product) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: "Product not found",
        });
      }
      reply.status(STATUS_CODES.OK).send({
        data: product,
      });
    }
  );

  getCompleteProduct = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { productId } = request.body as { productId: string };
      const product = await this.productService.getCompleteProduct(productId);
      if (!product) {
        return reply.status(STATUS_CODES.NOT_FOUND).send({
          message: "Product not found",
        });
      }
      reply.status(STATUS_CODES.OK).send({
        data: product,
      });
    }
  );

  updateProduct = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const productData = request.body as Partial<ProductData>;
      const product = await this.productService.updateProduct(productData);
      reply.status(STATUS_CODES.OK).send({
        data: product,
      });
    }
  );

  deleteProduct = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { productId } = request.query as { productId: string };
      const result = await this.productService.deleteProduct(productId);
      reply.status(STATUS_CODES.OK).send({
        message: result.message,
      });
    }
  );

  getAllProductsSearch = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const {
        search,
        page = 1,
        limit = 10,
      } = request.query as {
        search?: string;
        page?: number;
        limit?: number;
      };
      const products = await this.productService.getAllProductsSearch(
        String(search),
        Number(page),
        Number(limit)
      );
      reply.status(STATUS_CODES.OK).send(products);
    }
  );

  createCompleteBrochure = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      interface CreateCompleteBrochureRequest {
        productData: ProductData;
        variantsData: Array<{
          variant: PlanVariantData;
          eligibilityMaster: EligibilityMasterData;
          premiumRules: MinPremiumRuleData[];
          linkData?: any;
        }>;
      }
      const body = request.body as CreateCompleteBrochureRequest;
      const data = await this.productService.createCompleteBrochure({
        productData: body.productData,
        variantsData: body.variantsData,
      });
      reply.status(STATUS_CODES.CREATED).send(data);
    }
  );

  getCompleteBrochureData = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = await this.productService.getCompleteBrochureData();
      reply.status(STATUS_CODES.OK).send(data);
    }
  );

  getCompleteSingleBrochureData = asyncHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { productId } = request.body as { productId: string };
      const data = await this.productService.getCompleteSingleBrochureData(
        productId
      );
      reply.status(STATUS_CODES.OK).send(data);
    }
  );
}

export default ProductController;
