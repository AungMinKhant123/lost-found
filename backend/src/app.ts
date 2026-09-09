import Fastify from "fastify";
import swaggerPlugin from "./plugins/swagger.js";
import errorHandlerPlugin from "./plugins/error-handler.js";
import jwtPlugin from "./plugins/jwt.js";
import { authRoutes } from "./routes/auth.js";

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
  await app.register(jwtPlugin);
  await app.register(authRoutes);

  return app;
}
