import type { FastifyReply, FastifyRequest } from "fastify";

import type { ItemListsRequestQuery } from "./requestQuery.js";
import type { ItemListsResponseBody } from "./responseBody.js";

import { prisma } from "../../../lib/prisma.js";

export async function itemListsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ItemListsResponseBody> {
  const query = request.query as ItemListsRequestQuery;

  const {
    search,
    type,
    status,
    category,
    color,
    fromDate,
    toDate,
    page: pageParam,
    limit: limitParam,
  } = query;

  /*
   * --------------------------------------------------
   * Pagination
   * --------------------------------------------------
   */

  const page = Math.max(Number(pageParam) || 1, 1);

  const limit = Math.min(Math.max(Number(limitParam) || 9, 1), 100);

  const skip = (page - 1) * limit;

  /*
   * --------------------------------------------------
   * Filters
   * --------------------------------------------------
   */

  const where = {
    ...(search && {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          location: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),

    ...(type && {
      type,
    }),

    ...(status && {
      status,
    }),

    ...(category && {
      category: {
        name: {
          equals: category,
          mode: "insensitive" as const,
        },
      },
    }),

    ...(color && {
      color: {
        name: {
          equals: color,
          mode: "insensitive" as const,
        },
      },
    }),

    ...((fromDate || toDate) && {
      dateLostOrFound: {
        ...(fromDate && {
          gte: new Date(fromDate),
        }),

        ...(toDate && {
          lte: new Date(toDate),
        }),
      },
    }),
  };

  /*
   * --------------------------------------------------
   * Database queries
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * Convert MinIO objectKey → imageUrl
   * --------------------------------------------------
   */

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
      };
    }),
  );

  /*
   * --------------------------------------------------
   * Pagination
   * --------------------------------------------------
   */

  const totalPages = Math.ceil(total / limit);

  /*
   * --------------------------------------------------
   * Response
   * --------------------------------------------------
   */

  return reply.send({
    data,

    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}
