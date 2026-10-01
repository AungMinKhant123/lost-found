import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import type { GetAcceptedClaimContactRequestParams } from "./requestParams.js";
import type { GetAcceptedClaimContactResponseBody } from "./responseBody.js";

export async function getAcceptedClaimContactHandler(
  request: FastifyRequest<{
    Params: GetAcceptedClaimContactRequestParams;
  }>,
  reply: FastifyReply,
): Promise<GetAcceptedClaimContactResponseBody> {
  const { itemId, claimId } = request.params;
  const userId = request.user.userId;

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { userId: true },
  });

  if (!item) {
    throw new AppError("Item not found.", 404);
  }

  if (item.userId !== userId) {
    throw new AppError(
      "You are not allowed to view this contact information.",
      403,
    );
  }

  const claim = await prisma.claim.findFirst({
    where: { id: claimId, itemId },
    select: {
      status: true,
      claimant: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          profileKey: true,
        },
      },
    },
  });

  if (!claim) {
    throw new AppError("Claim not found for this item.", 404);
  }

  if (claim.status !== "ACCEPTED") {
    throw new AppError(
      "Contact information is available only for accepted claims.",
      409,
    );
  }

  const profileUrl = claim.claimant.profileKey
    ? await request.server.minio.presignedGetObject(
        process.env.MINIO_BUCKET!,
        claim.claimant.profileKey,
        60 * 60,
      )
    : null;

  return reply.send({
    data: {
      firstName: claim.claimant.firstName,
      lastName: claim.claimant.lastName,
      email: claim.claimant.email,
      phone: claim.claimant.phone,
      profileUrl,
    },
  });
}
