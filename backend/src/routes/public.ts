import type { FastifyInstance } from "fastify";
import { LatestItemsResponseBodySchema } from "../handlers/public/latestItems/responseBody.js";
import { latestItemsHandler } from "../handlers/public/latestItems/handler.js";
import { ItemListsSchema } from "../handlers/public/itemLists/schema.js";
import { itemListsHandler } from "../handlers/public/itemLists/handler.js";
import { CreateNewPostSchema } from "../handlers/public/createNewPost/schema.js";
import { createNewPostHandler } from "../handlers/public/createNewPost/handler.js";
import { GetCategorySchema } from "../handlers/public/getCategory/schema.js";
import { getCategoryHandler } from "../handlers/public/getCategory/handler.js";
import { GetColorSchema } from "../handlers/public/getColor/schema.js";
import { getColorHandler } from "../handlers/public/getColor/handler.js";

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
  );

  app.put(
    "/public/createNewPost",
    {
      preHandler: app.verifyUser,
      schema: CreateNewPostSchema,
    },
    createNewPostHandler,
  );

  app.get(
    "/public/getCategories",
    {
      schema: GetCategorySchema,
    },
    getCategoryHandler
  );

  app.get(
    "/public/getColors",
    {
      schema: GetColorSchema,
    },
    getColorHandler
  )
}
