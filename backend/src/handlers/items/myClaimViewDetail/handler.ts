import type { FastifyReply, FastifyRequest } from "fastify";

import type { MyClaimDetailsRequestParams } from "./requestParams.js";

import type { MyClaimDetailsResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";

export async function myClaimDetailsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<MyClaimDetailsResponseBody> {
  const { claimId } = request.params as MyClaimDetailsRequestParams;

  const userId = request.user.userId;

  const claim = await prisma.claim.findFirst({
    where: {
      id: claimId,
      claimantId: userId,
    },

    include: {
      item: {
        select: {
          id: true,
          type: true,
          title: true,
          location: true,
          dateLostOrFound: true,

          images: {
            select: {
              id: true,
              objectKey: true,
            },
          },

          user: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
              email: true,
              profileKey: true,
            },
          },
        },
      },
    },
  });

  if (!claim) {
    throw new AppError("Claim not found!", 404);
  }

  const images = await Promise.all(
    claim.item.images.map(async (image) => ({
      id: image.id,
      imageUrl: await request.server.minio.presignedGetObject(
        process.env.MINIO_BUCKET || "lost-found",
        image.objectKey,
        60 * 60,
      ),
    })),
  );

  const response = {
    id: claim.id,
    status: claim.status,
    message: claim.message,
    createdAt: claim.createdAt.toISOString(),

    item: {
      ...claim.item,
      images,
    },

    ...(claim.status === "ACCEPTED" && {
      poster: claim.item.user,
    }),
  };

  return reply.send({
    data: response,
  });
}
