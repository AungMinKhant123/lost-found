import type { FastifyReply, FastifyRequest } from "fastify";

import type { MyClaimsRequestQuery } from "./requestQuery.js";

import type { MyClaimsResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";

export async function myClaimsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<MyClaimsResponseBody> {
  const query = request.query as MyClaimsRequestQuery;

  const userId = request.user.userId;

  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 3, 1), 6);

  const skip = (page - 1) * limit;

  const where = {
    claimantId: userId,

    ...(query.claimStatus && {
      status: query.claimStatus,
    }),
  };

  const [total, claims, statusCounts] = await Promise.all([
    prisma.claim.count({ where }),

    prisma.claim.findMany({
      where,
      skip,
      take: limit,

      include: {
        item: {
          include: {
            category: true,
            color: true,
            images: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.claim.groupBy({
      by: ["status"],
      where: {
        claimantId: userId,
      },
      _count: {
        _all: true,
      },
    }),
  ]);

  const pending =
    statusCounts.find((item) => item.status === "PENDING")?._count._all ?? 0;
  const accepted =
    statusCounts.find((item) => item.status === "ACCEPTED")?._count._all ?? 0;
  const declined =
    statusCounts.find((item) => item.status === "DECLINED")?._count._all ?? 0;
  const data = await Promise.all(
    claims.map(async (claim) => ({
      id: claim.id,
      status: claim.status,
      createdAt: claim.createdAt.toISOString(),
      item: {
        id: claim.item.id,
        type: claim.item.type,
        status: claim.item.status,
        title: claim.item.title,
        location: claim.item.location,
        dateLostOrFound: claim.item.dateLostOrFound.toISOString(),
        category: claim.item.category,
        color: claim.item.color,
        images: await Promise.all(
          claim.item.images.map(async (image) => ({
            id: image.id,
            imageUrl: await request.server.minio.presignedGetObject(
              process.env.MINIO_BUCKET!,
              image.objectKey,
              60 * 60,
            ),
          })),
        ),
      },
    })),
  );

  const all = pending + accepted + declined;

  return reply.send({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    counts: {
      all,
      pending,
      accepted,
      declined,
    },
  });
}
