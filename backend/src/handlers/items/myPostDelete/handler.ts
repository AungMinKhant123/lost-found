import type { FastifyReply, FastifyRequest } from "fastify";

import type { MyPostDeleteRequestParams } from "./requestParams.js";

import type { MyPostDeleteResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";

export async function myPostDeleteHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<MyPostDeleteResponseBody> {
  const { itemId } = request.params as MyPostDeleteRequestParams;

  const userId = request.user.userId;

  const item = await prisma.item.findFirst({
    where: {
        id: itemId,
        userId: userId,
    }
  });

  if(!item) {
    throw new AppError("Item not found!", 404);
  }

  await prisma.item.delete({
    where: {
        id: itemId,
    }
  })

  return reply.send({
    message: "This post is successfully deleted.",
  });
}
