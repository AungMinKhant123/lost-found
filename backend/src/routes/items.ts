import { FastifyInstance } from "fastify";
import { createItem } from "../handlers/item.handler.js";
import { createItemBodySchema, itemSchema } from "../schemas/item.schema.js";
import { ItemType } from "../generated/enums.js";

export default async function itemRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return {
      message: "Lost and Found API is running",
    };
  });

  app.post<{
    Body: {
      type: ItemType;
      title: string;
      description?: string;
      categoryId: string;
      location: string;
      colorId: string;
      dateLostOrFound: string;
      imageUrls?: string[];
    };
  }>(
    "/items",
    {
      preHandler: app.verifyUser,
      schema: {
        tags: ["Items"],
        summary: "Create an item",
        security: [
          {
            bearerAuth: [],
          },
        ],
        body: createItemBodySchema,
        response: {
          201: itemSchema,
        },
      },
    },
    createItem,
  );
}
