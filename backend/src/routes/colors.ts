import type { FastifyInstance } from "fastify";
import { GetColorSchema } from "../handlers/color/getColors/schema.js";
import { getColorHandler } from "../handlers/color/getColors/handler.js";

export async function colorRoutes(app: FastifyInstance) {
  app.get(
    "/colors",
    {
      schema: GetColorSchema,
    },
    getColorHandler,
  );
}
