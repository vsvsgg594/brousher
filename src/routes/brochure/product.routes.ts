import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import ProductController from "../../controllers/brochure/product.controller";
import {
  validateProduct,
  validateUpdateProduct,
  validateDeleteProduct,
  validateGetProductById,
  validateGetCompleteProduct,
  validateProductSearch,
  validateCompleteBrochure,
  validateGetCompleteSingleBrochure,
} from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/function/asyncHandler.function";

class ProductRouter {
  private productController: ProductController;
  constructor() {
    this.productController = new ProductController();
  }

  async registerRoutes(fastify: FastifyInstance) {
    fastify.post(
      "/product",
      {
        preHandler: validateProduct
      },
      asyncHandler(this.productController.createProduct)
    );

    fastify.get(
      "/products",
      {
        preHandler: validateProductSearch
      },
      asyncHandler(this.productController.getAllProducts)
    );

    fastify.get(
      "/product",
      {
        preHandler: validateGetProductById
      },
      asyncHandler(this.productController.getProductById)
    );

    fastify.put(
      "/product",
      {
        preHandler: validateUpdateProduct
      },
      asyncHandler(this.productController.updateProduct)
    );

    fastify.post(
      "/product/complete",
      {
        preHandler: validateGetCompleteProduct
      },
      asyncHandler(this.productController.getCompleteProduct)
    );

    fastify.delete(
      "/product",
      {
        preHandler: validateDeleteProduct
      },
      asyncHandler(this.productController.deleteProduct)
    );

    fastify.get(
      "/products/search",
      {
        preHandler: validateProductSearch
      },
      asyncHandler(this.productController.getAllProductsSearch)
    );

    fastify.post(
      "/complete",
      // {
      //   preHandler: validateCompleteBrochure // Currently commented
      // },
      asyncHandler(this.productController.createCompleteBrochure)
    );

    fastify.get(
      "/complete",
      asyncHandler(this.productController.getCompleteBrochureData)
    );

    fastify.post(
      "/complete/single",
      {
        preHandler: validateGetCompleteSingleBrochure
      },
      asyncHandler(this.productController.getCompleteSingleBrochureData)
    );
  }
}

export default ProductRouter;