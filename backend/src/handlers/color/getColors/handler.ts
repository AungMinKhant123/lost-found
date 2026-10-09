import type { FastifyReply, FastifyRequest } from "fastify";

import type { GetColorResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";

export async function getColorHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<GetColorResponseBody> {
  const colors = await prisma.color.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      hexCode: true,
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  return colors.map((color) => ({
    id: color.id,
    name: color.name,
    hexCode: color.hexCode,
    itemCount: color._count.items,
  }));
}
