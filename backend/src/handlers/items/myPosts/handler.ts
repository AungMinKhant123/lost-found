import type { FastifyReply, FastifyRequest } from "fastify";

import type { MyPostsRequestQuery } from "./requestQuery.js";

import type { MyPostsResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";

export async function myPostsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<MyPostsResponseBody> {
  const query = request.query as MyPostsRequestQuery;

  const userId = request.user.userId;

  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(
    Math.max(Number(query.limit) || 6, 1),
    9
  )

  const skip = (page - 1) * limit;

  const where = {
    userId,

    ...(query.type && {
        type: query.type
    }),

    ...(query.status && {
        status: query.status
    }),
  };

  const [total, items] = await Promise.all([
    prisma.item.count({ where }),

    prisma.item.findMany({
        where,
        skip,
        take: limit,

        include: {
            category: true,
            color: true,
            images: true,
        },

        orderBy: {
            createdAt: "desc",
        }
    })
  ]);

  return reply.send({
    data: items,
    pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    }
  });
}
