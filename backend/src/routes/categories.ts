import type { FastifyInstance } from "fastify";
import { GetCategoriesSchema } from "../handlers/category/getCategories/schema.js";
import { getCategoriesHandler } from "../handlers/category/getCategories/handler.js";
import { AddCategorySchema } from "../handlers/category/addCategory/schema.js";
import { addCategoryHandler } from "../handlers/category/addCategory/handler.js";

export async function categoryRoutes(app: FastifyInstance) {
  app.get(
    "/categories",
    {
      schema: GetCategoriesSchema,
    },
    getCategoriesHandler,
  );

  app.post(
    "/categories",
    {
      preHandler: app.verifyAdmin,
      schema: AddCategorySchema,
    },
    addCategoryHandler,
  )
}
