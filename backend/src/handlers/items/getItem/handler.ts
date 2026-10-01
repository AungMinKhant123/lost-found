import type { FastifyReply, FastifyRequest } from "fastify";

import type { GetItemRequestParams } from "./requestParams.js";
import type { GetItemResponseBody } from "./responseBody.js";

import { prisma } from "../../../lib/prisma.js";

export async function getItemHandler(
  request: FastifyRequest<{
    Params: GetItemRequestParams;
  }>,
  reply: FastifyReply,
): Promise<GetItemResponseBody> {
  const { id } = request.params;

  const item = await prisma.item.findUnique({
    where: {
      id,
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
    },
  });

  if (!item) {
    return reply.code(404).send({
      message: "Item not found",
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
  });
}
