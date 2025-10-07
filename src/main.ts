require("dotenv").config();
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import routes from "./routes";
import sequelize from "./utils/config.utils";
import { BASE_URL, NODE_ENV } from "./utils/constants.utils";
import defineAssociations from "./associations";

const fastify = Fastify({
  logger: NODE_ENV !== "production"
});

const start = async () => {
  try {
    await fastify.register(fastifyHelmet)
    await fastify.register(fastifyCors, {
      origin: BASE_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    });

    await fastify.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET || "your-secret-key"
    });

    if (NODE_ENV === "production") {
      fastify.addHook("onRequest", async (request, reply) => {
        if (request.headers["x-forwarded-proto"] !== "https") {
          return reply.redirect(`https://${request.headers.host}${request.url}`);
        }
      });
    }

    fastify.get("/health", async () => {
      return { message: "Server is running" };
    });

    await fastify.register(routes);

    fastify.setErrorHandler((error: any, request, reply) => {
      console.error("Server Error:", error.message);
      if (error.code === "EBADCSRFTOKEN") {
        return reply.status(403).send({ message: "Invalid CSRF token" });
      }
      const statusCode = error.statusCode || 500;
      reply.status(statusCode).send({ 
        message: statusCode === 500 ? "Something went wrong" : error.message 
      });
    });

    fastify.setNotFoundHandler((request, reply) => {
      reply.status(404).send({ 
        message: "Route not found",
        path: request.url 
      });
    });

    defineAssociations();
    await sequelize.authenticate();    
    await sequelize.sync();

    const port = Number(process.env.PORT) || 3000;
    const host = NODE_ENV === "production" ? "0.0.0.0" : "localhost";
    await fastify.listen({ port, host });
    console.log(`Server is running on port ${port}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`Health check: http://${host}:${port}/health`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");
  try {
    await fastify.close();
    await sequelize.close();
    console.log("All connections closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

start();

export { fastify };
