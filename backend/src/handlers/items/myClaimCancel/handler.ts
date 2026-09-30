import type { FastifyReply, FastifyRequest } from "fastify";

import type { MyClaimCancelRequestParams } from "./requestParams.js";

import type { MyClaimCancelResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";

export async function myClaimCancelHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<MyClaimCancelResponseBody> {
  const { claimId } = request.params as MyClaimCancelRequestParams;

  const userId = request.user.userId;

  const claim = await prisma.claim.findFirst({
    where: {
        id: claimId,
        claimantId: userId,
    }
  });

  if (!claim) {
    throw new AppError("Claim not found.", 404);
  }

  if (claim.status !== "PENDING") {
    throw new AppError("Only pending claims can be cnacelled.", 400);
  }

  await prisma.claim.delete({
    where: {
        id: claimId,
    }
  })

  return reply.send({
    message: "Claim cancelled successfully!",
  });
}
