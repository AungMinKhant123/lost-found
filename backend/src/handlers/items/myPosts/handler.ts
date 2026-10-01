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

  const limit = Math.min(Math.max(Number(query.limit) || 6, 1), 9);

  const skip = (page - 1) * limit;

  const where = {
  userId,

    ...(query.type && {
      type: query.type,
    }),

    ...(query.status && {
      status: query.status,
    }),
  };

  const [total, items] = await Promise.all([
    prisma.item.count({
      where,
    }),

    prisma.item.findMany({
      where,

      skip,
      take: limit,

      select: {
        id: true,

        title: true,

        description: true,

        type: true,

        status: true,

        location: true,

        dateLostOrFound: true,

        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  }),
]);

        color: {
          select: {
            id: true,
            name: true,
          },
        },

        images: {
          select: {
            id: true,
            objectKey: true,
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

  const pendingClaimCounts = await prisma.claim.groupBy({
    by: ["itemId"],
    where: {
      itemId: { in: items.map((item) => item.id) },
      status: "PENDING",
    },
    _count: { _all: true },
  });
  const pendingCountsByItemId = new Map(
    pendingClaimCounts.map((claim) => [claim.itemId, claim._count._all]),
  );

  const data = await Promise.all(
    items.map(async (item) => {
      const images = await Promise.all(
        item.images.map(async (image) => {
          const imageUrl = await request.server.minio.presignedGetObject(
            process.env.MINIO_BUCKET!,
            image.objectKey,
            60 * 60,
          );

          return {
            id: image.id,
            imageUrl,
          };
        }),
      );

      return {
        id: item.id,

        title: item.title,

        description: item.description,

        type: item.type,

        status: item.status,

        location: item.location,

        dateLostOrFound: item.dateLostOrFound.toISOString(),

        category: item.category,

        color: item.color,

        images,

        pendingClaimsCount: pendingCountsByItemId.get(item.id) ?? 0,
      };
    }),
  );

  const totalPages = Math.ceil(total / limit);

  return reply.send({
    data: formattedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}
