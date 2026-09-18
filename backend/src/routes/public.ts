import type { FastifyInstance } from "fastify";
import { LatestItemsResponseBodySchema } from "../handlers/public/latestItems/responseBody.js";
import { latestItemsHandler } from "../handlers/public/latestItems/handler.js";

export async function publicRoutes(app: FastifyInstance) {
  app.get(
    "/public/latest-items",
    {
      schema: LatestItemsResponseBodySchema,
    },
    latestItemsHandler,
  );
}
