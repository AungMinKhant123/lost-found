import type { FastifyReply, FastifyRequest } from "fastify";

import type { DeleteItemRequestParams } from "./requestParams.js";

import type { DeleteItemResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";

export async function deleteItemHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<DeleteItemResponseBody> {
  const { itemId } = request.params as DeleteItemRequestParams;

  const item = await prisma.item.findUnique({
    where: {
        id: itemId,
    },
  });

  if(!item) {
    throw new AppError("Item not found!", 404);
  };

  await prisma.item.delete({
    where: {
        id: itemId,
    },
  });

  return reply.send({
    message: "Item delete successfull!",
  });
}
