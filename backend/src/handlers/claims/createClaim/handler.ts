import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import type { CreateClaimRequestBody } from "./requestBody.js";
import type { CreateClaimResponseBody } from "./responseBody.js";

export async function createClaimHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<CreateClaimResponseBody> {
  const { itemId, message } = request.body as CreateClaimRequestBody;
  const claimantId = request.user.userId;

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { id: true, userId: true, status: true },
  });

  if (!item) {
    throw new AppError("Item not found.", 404);
  }

  if (item.userId === claimantId) {
    throw new AppError("You cannot claim your own item.", 403);
  }

  if (item.status !== "OPEN") {
    throw new AppError("This item is no longer available to claim.", 409);
  }

  const existingClaim = await prisma.claim.findUnique({
    where: {
      itemId_claimantId: { itemId, claimantId },
    },
    select: { id: true },
  });

  if (existingClaim) {
    throw new AppError("You have already claimed this item.", 409);
  }

  const claim = await prisma.claim.create({
    data: {
      itemId,
      claimantId,
      message: message.trim(),
    },
  });

  return reply.code(201).send({
    id: claim.id,
    status: claim.status,
    createdAt: claim.createdAt.toISOString(),
  });
}
