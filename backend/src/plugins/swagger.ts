import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export default fp(async (app: FastifyInstance) => {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Lost and Found API",
        description: "Lost and found backend API",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });
  await app.register(swaggerUI, {
    routePrefix: "/docs",
  });
});
