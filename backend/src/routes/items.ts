import type { FastifyInstance } from "fastify";
import { CreateItemSchema } from "../handlers/item/createNewPost/schema.js";
import { createItemHandler } from "../handlers/item/createNewPost/handler.js";

export async function itemRoutes(app: FastifyInstance) {
  app.put(
    "/public/createNewPost",
    {
      preHandler: app.verifyUser,
      schema: CreateItemSchema,
    },
    createItemHandler,
  );
}
