import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import type { UpdateItemClaimStatusRequestBody } from "./requestBody.js";
import type { UpdateItemClaimStatusRequestParams } from "./requestParams.js";
import type { UpdateItemClaimStatusResponseBody } from "./responseBody.js";

export async function updateItemClaimStatusHandler(
  request: FastifyRequest<{
    Params: UpdateItemClaimStatusRequestParams;
    Body: UpdateItemClaimStatusRequestBody;
  }>,
  reply: FastifyReply,
): Promise<UpdateItemClaimStatusResponseBody> {
  const { itemId, claimId } = request.params;
  const { status } = request.body;
  const userId = request.user.userId;

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { id: true, userId: true, status: true },
  });

  if (!item) {
    throw new AppError("Item not found.", 404);
  }

  if (item.userId !== userId) {
    throw new AppError(
      "You are not allowed to update claims for this item.",
      403,
    );
  }

  if (item.status !== "OPEN") {
    throw new AppError("This item is already resolved.", 409);
  }

  const claim = await prisma.claim.findFirst({
    where: { id: claimId, itemId },
    select: { id: true, status: true },
  });

  if (!claim) {
    throw new AppError("Claim not found for this item.", 404);
  }

  if (claim.status !== "PENDING") {
    throw new AppError("Only pending claims can be updated.", 409);
  }

  const updatedClaim = await prisma.$transaction(async (transaction) => {
    const result = await transaction.claim.updateMany({
      where: { id: claimId, itemId, status: "PENDING" },
      data: { status },
    });

    if (result.count === 0) {
      throw new AppError("This claim has already been updated.", 409);
    }

    if (status === "ACCEPTED") {
      await transaction.claim.updateMany({
        where: { itemId, id: { not: claimId }, status: "PENDING" },
        data: { status: "DECLINED" },
      });

      await transaction.item.update({
        where: { id: itemId },
        data: { status: "RESOLVED" },
      });
    }

    return transaction.claim.findUniqueOrThrow({
      where: { id: claimId },
      select: { id: true, status: true },
    });
  });

  return reply.send(updatedClaim);
}
