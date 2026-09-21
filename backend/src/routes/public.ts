import type { FastifyInstance } from "fastify";
import { LatestItemsResponseBodySchema } from "../handlers/public/latestItems/responseBody.js";
import { latestItemsHandler } from "../handlers/public/latestItems/handler.js";
import { ItemListsSchema } from "../handlers/public/itemLists/schema.js";
import { itemListsHandler } from "../handlers/public/itemLists/handler.js";

export async function publicRoutes(app: FastifyInstance) {
  app.get(
    "/public/latest-items",
    {
      schema: LatestItemsResponseBodySchema,
    },
    latestItemsHandler,
  );

  app.get(
    "/public/items",
    {
      schema: ItemListsSchema,
    },
    itemListsHandler,
  )
}
