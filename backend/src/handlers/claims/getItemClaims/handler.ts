import type { FastifyReply, FastifyRequest } from "fastify";

import type { GetItemClaimsRequestParams } from "./requestParams.js";
import type { GetItemClaimsResponseBody } from "./responseBody.js";

import { prisma } from "../../../lib/prisma.js";

export async function getItemClaimsHandler(
  request: FastifyRequest<{
    Params: GetItemClaimsRequestParams;
  }>,
  reply: FastifyReply,
): Promise<GetItemClaimsResponseBody> {
  const { id } = request.params;

  const userId = request.user.userId;

  const item = await prisma.item.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      userId: true,
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

      claims: {
        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          message: true,
          status: true,
          createdAt: true,

          claimant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              profileKey: true,
            },
          },
        },
      },
    },
  });

  if (!item) {
    return reply.code(404).send({
      message: "Item not found",
    } as never);
  }

  // Only the owner can view claims for this item.
  if (item.userId !== userId) {
    return reply.code(403).send({
      message: "You are not allowed to view claims for this item",
    } as never);
  }

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

  const claims = await Promise.all(
    item.claims.map(async (claim) => {
      let profileUrl: string | null = null;

      if (claim.claimant.profileKey) {
        profileUrl = await request.server.minio.presignedGetObject(
          process.env.MINIO_BUCKET!,
          claim.claimant.profileKey,
          60 * 60,
        );
      }

      return {
        id: claim.id,
        message: claim.message,
        status: claim.status,
        createdAt: claim.createdAt.toISOString(),
        claimant: {
          id: claim.claimant.id,
          firstName: claim.claimant.firstName,
          lastName: claim.claimant.lastName,
          email: claim.claimant.email,
          phone: claim.claimant.phone,
          profileKey: claim.claimant.profileKey,
          profileUrl,
        },
      };
    }),
  );

  return reply.send({
    item: {
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
    },

    claims,
  });
}
