import type { FastifyReply, FastifyRequest } from "fastify";

import type { ManageListingsRequestQuery } from "./requestQuery.js";
import type { ManageListingsResponseBody } from "./responseBody.js";

import { prisma } from "../../../lib/prisma.js";

export async function manageListingsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ManageListingsResponseBody> {
  const query =
    request.query as ManageListingsRequestQuery;

  const page = Math.max(
    Number(query.page) || 1,
    1,
  );

  const limit = Math.min(
    Math.max(Number(query.limit) || 8, 1),
    100,
  );

  const skip = (page - 1) * limit;

  const searchTerm = query.search?.trim();
  const searchTerms = searchTerm?.split(/\s+/) ?? [];

  const where = {
    ...(searchTerm && {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive" as const,
          },
        },
        {
          user: {
            AND: searchTerms.map((term) => ({
              OR: [
                {
                  firstName: {
                    contains: term,
                    mode: "insensitive" as const,
                  },
                },
                {
                  lastName: {
                    contains: term,
                    mode: "insensitive" as const,
                  },
                },
              ],
            })),
          },
        },
        {
          user: {
            OR: [
              {
                firstName: {
                  contains: searchTerm,
                  mode: "insensitive" as const,
                },
              },
              {
                lastName: {
                  contains: searchTerm,
                  mode: "insensitive" as const,
                },
              },
            ],
          },
        },
      ],
    }),

    ...(query.status && {
      status: query.status,
    }),

    ...(query.type && {
      type: query.type,
    }),

    ...(query.categoryId && {
      categoryId: query.categoryId,
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
        type: true,
        status: true,
        createdAt: true,

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

        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return reply.send({
    data: items,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}