import type { FastifyReply, FastifyRequest } from "fastify";

import type { MyPostViewDetailRequestParams } from "./requestParams.js";

import type { MyPostViewDetailResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";

export async function myPostViewDetailHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<MyPostViewDetailResponseBody> {
  const { itemId } = request.params as MyPostViewDetailRequestParams;

  const userId = request.user.userId;

  const item = await prisma.item.findFirst({
    where: {
        id: itemId,
        userId,
    },
    include: {
        category: true,
        color: true,
        images: true,

        claims: {
            include: {
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

  if(!item) {
    throw new AppError("Post not found!", 404);
  }

  return reply.send({
    data: item,
  });
}
