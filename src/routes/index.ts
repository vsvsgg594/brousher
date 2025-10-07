import { FastifyInstance, FastifyPluginOptions } from "fastify";
import BrochureRouter from "./brochure/index";

export default async function (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  const brochureRouter = new BrochureRouter();
  await fastify.register(brochureRouter.registerRoutes, {
    prefix: "/brochure",
  });
}
