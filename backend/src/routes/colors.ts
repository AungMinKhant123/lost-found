import type { FastifyInstance } from "fastify";
import { GetColorSchema } from "../handlers/color/getColors/schema.js";
import { getColorHandler } from "../handlers/color/getColors/handler.js";
import { CreateColorSchema } from "../handlers/color/manageColors/createSchema.js";
import { createColorHandler } from "../handlers/color/manageColors/createHandler.js";
import { UpdateColorSchema } from "../handlers/color/manageColors/updateSchema.js";
import { updateColorHandler } from "../handlers/color/manageColors/updateHandler.js";
import { DeleteColorSchema } from "../handlers/color/manageColors/deleteSchema.js";
import { deleteColorHandler } from "../handlers/color/manageColors/deleteHandler.js";

export async function colorRoutes(app: FastifyInstance) {
  app.get(
    "/colors",
    {
      schema: GetColorSchema,
    },
    getColorHandler,
  );

  app.post(
    "/colors",
    {
      preHandler: app.verifyAdmin,
      schema: CreateColorSchema,
    },
    createColorHandler,
  );

  app.put(
    "/colors/:colorId",
    {
      preHandler: app.verifyAdmin,
      schema: UpdateColorSchema,
    },
    updateColorHandler,
  );

  app.delete(
    "/colors/:colorId",
    {
      preHandler: app.verifyAdmin,
      schema: DeleteColorSchema,
    },
    deleteColorHandler,
  );
}
