import type { FastifyReply, FastifyRequest } from "fastify";

import type { MyPostViewDetailRequestParams } from "./requestParams.js";
import type { MyPostViewDetailResponseBody } from "./responseBody.js";

import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";

export async function myPostViewDetailHandler(
  request: FastifyRequest<{
    Params: MyPostViewDetailRequestParams;
  }>,
  reply: FastifyReply,
): Promise<MyPostViewDetailResponseBody> {
  const { itemId } = request.params;

  const userId = request.user.userId;

  const item = await prisma.item.findFirst({
    where: {
      id: itemId,
      userId,
    },

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
          status: true,
          createdAt: true,

          claimant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileKey: true,
            },
          },
        },
      },
    },
  });

  if (!item) {
    throw new AppError("Post not found!", 404);
  }

  // Generate presigned URLs for item images
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

  // Generate presigned URLs for claimant profile images
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
        status: claim.status,
        createdAt: claim.createdAt.toISOString(),

        claimant: {
          id: claim.claimant.id,
          firstName: claim.claimant.firstName,
          lastName: claim.claimant.lastName,
          profileUrl,
        },
      };
    }),
  );

  return reply.send({
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
    claims,
  });
}
