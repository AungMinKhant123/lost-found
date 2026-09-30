import type { FastifyInstance } from "fastify";
import { ItemListsSchema } from "../handlers/public/itemLists/schema.js";
import { itemListsHandler } from "../handlers/public/itemLists/handler.js";

export async function publicRoutes(app: FastifyInstance) {
  app.get(
    "/public/items",
    {
      schema: ItemListsSchema,
    },
    itemListsHandler,
  );
}
