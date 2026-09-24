import type { FastifyReply, FastifyRequest } from "fastify";

import type { GetCategoriesResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";

export async function getCategoriesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<GetCategoriesResponseBody> {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return categories;
}
