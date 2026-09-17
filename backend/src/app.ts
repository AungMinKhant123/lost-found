import Fastify from "fastify";
import swaggerPlugin from "./plugins/swagger.js";
import errorHandlerPlugin from "./plugins/error-handler.js";
import jwtPlugin from "./plugins/jwt.js";
import { authRoutes } from "./routes/auth.js";
import authPlugin from "./plugins/auth.js";
import cookie from "@fastify/cookie";
import { publicRoutes } from "./routes/public.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,

    ajv: {
      customOptions: {
        coerceTypes: false,
        removeAdditional: false,
      },
    },
  });

  await app.register(swaggerPlugin);
  await app.register(errorHandlerPlugin);
  app.register(cookie);
  await app.register(jwtPlugin);
  await app.register(authPlugin);
  await app.register(authRoutes);
  await app.register(publicRoutes);

  return app;
}
