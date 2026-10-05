import type { FastifyReply, FastifyRequest } from "fastify";

import type { ViewItemRequestParams } from "./requestParams.js";

import type { ViewItemResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";

export async function viewItemHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ViewItemResponseBody> {
  const { itemId } = request.params as ViewItemRequestParams;

  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },

    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      description: true,
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

      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          socialMedia: true,
          profession: true,
        },
      },

      claims: {
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
              profileKey: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!item) {
    throw new AppError("Item not found!", 404);
  }

  const poster = {
    name: `${item.user.firstName} ${item.user.lastName}`.trim(),
    email: item.user.email,

    ...(item.user.phone && {
      phone: item.user.phone,
    }),

    ...(item.user.socialMedia && {
      socialMedia: item.user.socialMedia,
    }),

    ...(item.user.profession && {
      profession: item.user.profession,
    }),
  };

  return reply.send({
    data: {
      id: item.id,
      title: item.title,
      type: item.type,
      status: item.status,
      description: item.description,
      location: item.location,

      dateLostOrFound: item.dateLostOrFound.toString(),

      category: item.category,
      color: item.color,
      images: item.images,

      poster,

      claims: item.claims.map((claim) => ({
        id: claim.id,
        message: claim.message,
        status: claim.status,
        createdAt: claim.createdAt.toISOString(),
        claimant: claim.claimant,
      })),
    },
  });
}
