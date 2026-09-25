import Fastify from "fastify";
import cookie from "@fastify/cookie";

import swaggerPlugin from "./plugins/swagger.js";
import errorHandlerPlugin from "./plugins/error-handler.js";
import jwtPlugin from "./plugins/jwt.js";
import authPlugin from "./plugins/auth.js";
import minioPlugin from "./plugins/minio.js";

import { authRoutes } from "./routes/auth.js";
import { publicRoutes } from "./routes/public.js";
import multipart from "./plugins/multipart.js";
import { itemsRoutes } from "./routes/items.js";
import { categoryRoutes } from "./routes/categories.js";
import { colorRoutes } from "./routes/colors.js";

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

  await app.register(cookie);
  await app.register(minioPlugin);
  await app.register(multipart);

  await app.register(jwtPlugin);

  await app.register(authPlugin);

  await app.register(authRoutes);
  await app.register(publicRoutes);
  await app.register(categoryRoutes);
  await app.register(colorRoutes);
  await app.register(itemsRoutes);

  return app;
}
