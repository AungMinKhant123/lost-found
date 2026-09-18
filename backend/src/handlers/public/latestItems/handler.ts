import type { FastifyReply, FastifyRequest } from "fastify";

import type { LatestItemsResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";

export async function latestItemsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<LatestItemsResponseBody> {
  const items = await prisma.item.findMany({
    take: 6,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      images: {
        take: 1,
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const data = items.map((item) => ({
    id: item.id,
    title: item.title,
    imageUrl: item.images[0]?.imageUrl ?? "",
    createdAt: item.createdAt.toISOString(),
    type: item.type,
    status: item.status,
  }));

  return reply.send({
    message: "Latest items retrieved successfully",
    data,
  });
}
