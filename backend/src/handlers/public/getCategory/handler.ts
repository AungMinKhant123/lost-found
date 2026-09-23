import type { FastifyReply, FastifyRequest } from "fastify";

import type { GetCategoryResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";

export async function getCategoryHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<GetCategoryResponseBody> {
  
  const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
        }
    })

  return reply.send({
    data: categories,
  });
}
