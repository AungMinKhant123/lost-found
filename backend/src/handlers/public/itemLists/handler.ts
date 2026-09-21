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

  const page = Math.max(Number(pageParam) || 1, 1);
  const limit = Math.min(Math.max(Number(limitParam) || 9, 1), 100);

  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      title: {
        contains: search,
        mode: "insensitive" as const,
      },
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
        }
      }
    }),

    ...((fromDate || toDate) && {
      dateLostOrFound: {
        ...(fromDate && {
          gte: new Date(fromDate),
        }),

        ...(toDate && {
          lte: new Date(toDate),
        })
      }
    })
  };

  const [total, items] = await Promise.all([
    prisma.item.count({
      where,
    }),

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
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return reply.send({
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages,      
    },
  });
}
