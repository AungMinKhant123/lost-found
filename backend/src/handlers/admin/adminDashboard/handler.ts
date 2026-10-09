import type { FastifyReply, FastifyRequest } from "fastify";

import type { AdminDashboardRequestQuery } from "./requestQuery.js";
import type { AdminDashboardResponseBody } from "./responseBody.js";

import { prisma } from "../../../lib/prisma.js";

function getDateRange(
  period: "ALL_TIME" | "THIS_YEAR" | "THIS_MONTH" | "THIS_WEEK" | "TODAY",
) {
  const now = new Date();

  if (period === "ALL_TIME") {
    return null;
  }

  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  if (period === "THIS_YEAR") {
    return {
      start: new Date(year, 0, 1),
      end: new Date(year + 1, 0, 1),
    };
  }

  if (period === "THIS_MONTH") {
    return {
      start: new Date(year, month, 1),
      end: new Date(year, month + 1, 1),
    };
  }

  if (period === "TODAY") {
    return {
      start: new Date(year, month, day),
      end: new Date(year, month, day + 1),
    };
  }

  const currentDay = now.getDay();
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;

  const start = new Date(year, month, day);

  start.setDate(start.getDate() - daysFromMonday);

  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return {
    start,
    end,
  };
}

export async function adminDashboardHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<AdminDashboardResponseBody> {
  const query = request.query as AdminDashboardRequestQuery;

  const period = query.period ?? "ALL_TIME";

  const dateRange = getDateRange(period);

  const categoryItemWhere = dateRange
    ? {
        createdAt: {
          gte: dateRange.start,
          lt: dateRange.end,
        },
      }
    : {};

  const [
    totalClaimsMade,
    resolvedItems,
    openItems,
    totalItemsPosted,
    categories,
    claimActivities,
    postActivities,
    resolvedActivities,
  ] = await Promise.all([
    prisma.claim.count(),

    prisma.item.count({
      where: {
        status: "RESOLVED",
      },
    }),

    prisma.item.count({
      where: {
        status: "OPEN",
      },
    }),

    prisma.item.count(),

    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,

        _count: {
          select: {
            items: {
              where: categoryItemWhere,
            },
          },
        },
      },
    }),

    prisma.claim.findMany({
      take: 12,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        createdAt: true,

        claimant: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),

    prisma.item.findMany({
      take: 12,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,

        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),

    prisma.item.findMany({
      where: {
        status: "RESOLVED",
        resolvedAt: {
          not: null,
        },
      },

      take: 12,

      orderBy: {
        resolvedAt: "desc",
      },

      select: {
        id: true,
        title: true,
        resolvedAt: true,
      },
    }),
  ]);

  const itemsByCategory = categories.map((category) => ({
    id: category.id,
    name: category.name,
    count: category._count.items,
  }));

  const recentActivity = [
    ...claimActivities.map((claim) => ({
      id: `claim-${claim.id}`,
      type: "CLAIM_SUBMITTED" as const,
      message:
        `${claim.claimant.firstName} ` +
        `${claim.claimant.lastName} submitted a claim`,
      occurredAt: claim.createdAt,
    })),

    ...postActivities.map((item) => ({
      id: `item-${item.id}`,
      type: "ITEM_POSTED" as const,
      message:
        `${item.user.firstName} ` +
        `${item.user.lastName} posted a ` +
        `${item.type === "LOST" ? "Lost" : "Found"} item`,
      occurredAt: item.createdAt, //This is used for time filter
    })),

    ...resolvedActivities.map((item) => ({
      id: `resolved-${item.id}`,
      type: "ITEM_RESOLVED" as const,
      message: `${item.title} was marked Resolved`,
      occurredAt: item.resolvedAt!,
    })),
  ]
    .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
    .slice(0, 12);

  return reply.send({
    data: {
      summary: {
        totalClaimsMade,
        resolvedItems,
        openItems,
        totalItemsPosted,
      },

      itemsByCategory,

      recentActivity: recentActivity.map((activity) => ({
        ...activity,
        occurredAt: activity.occurredAt.toISOString(),
      })),
    },
  });
}
