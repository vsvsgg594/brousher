import { FastifyInstance, FastifyPluginOptions } from "fastify";
import ProductRouter from "./product.routes";
import VariantRouter from "./variant.routes";
import EligibilityRouter from "./eligibility.routes";
import PremiumRuleRouter from "./premium.routes";
import AiSummaryRouter from "./aiSummary.routes";

class BrochureRouter {
  async registerRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    // Initialize all routers
    const productRouter = new ProductRouter();
    const variantRouter = new VariantRouter();
    const eligibilityRouter = new EligibilityRouter();
    const premiumRuleRouter = new PremiumRuleRouter();
    const aiSummaryRouter = new AiSummaryRouter();

    // Register all routers
    await productRouter.registerRoutes(fastify);
    await variantRouter.registerRoutes(fastify);
    await eligibilityRouter.registerRoutes(fastify);
    await premiumRuleRouter.registerRoutes(fastify);
    await aiSummaryRouter.registerRoutes(fastify);
  }
}

export default BrochureRouter;