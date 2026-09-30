import type { FastifyReply, FastifyRequest } from "fastify";

import type { MyPostsRequestQuery } from "./requestQuery.js";

import type { MyPostsResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";
import { ClaimStatus } from "../../../generated/enums.js";

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

  ...(query.pendingClaims
    ? {
        claims: {
          some: {
            status: ClaimStatus.PENDING,
            claimantId: {
              not: userId,
            },
          },
        },
      }
    : {
        ...(query.type && {
          type: query.type,
        }),

        ...(query.status && {
          status: query.status,
        }),
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

      _count: {
        select: {
          claims: {
            where: {
              status: ClaimStatus.PENDING,
              claimantId: {
                not: userId,
              },
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  }),
]);

const formattedItems = items.map(({ _count, ...item}) => ({
  ...item,
  pendingClaims: _count.claims,
}));

  return reply.send({
    data: formattedItems,
    pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    }
  });
}
