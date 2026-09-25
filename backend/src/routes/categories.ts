import type { FastifyInstance } from "fastify";
import { GetCategoriesSchema } from "../handlers/category/getCategories/schema.js";
import { getCategoriesHandler } from "../handlers/category/getCategories/handler.js";

export async function categoryRoutes(app: FastifyInstance) {
  app.get(
    "/categories",
    {
      schema: GetCategoriesSchema,
    },
    getCategoriesHandler,
  );
}
