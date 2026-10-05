import type { FastifyInstance } from "fastify";
import { GetCategoriesSchema } from "../handlers/category/getCategories/schema.js";
import { getCategoriesHandler } from "../handlers/category/getCategories/handler.js";
import { AddCategorySchema } from "../handlers/category/addCategory/schema.js";
import { addCategoryHandler } from "../handlers/category/addCategory/handler.js";
import { EditCategorySchema } from "../handlers/category/editCategory/schema.js";
import { editCategoryHandler } from "../handlers/category/editCategory/handler.js";
import { DeleteCategorySchema } from "../handlers/category/deleteCategory/schema.js";
import { deleteCategoryHandler } from "../handlers/category/deleteCategory/handler.js";

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
  );

  app.put(
    "/categories/:categoryId",
    {
      preHandler: app.verifyAdmin,
      schema: EditCategorySchema,
    },
    editCategoryHandler,
  );

  app.delete(
    "/categories/:categoryId",
    {
      preHandler: app.verifyAdmin,
      schema: DeleteCategorySchema,
    },
    deleteCategoryHandler,
  )
}
