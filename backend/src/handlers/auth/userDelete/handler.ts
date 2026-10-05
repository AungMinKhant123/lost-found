import type { FastifyReply, FastifyRequest } from "fastify";

import type { UserDeleteResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";

export async function userDeleteHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<UserDeleteResponseBody> {
  const userId = request.user.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      profileKey: true,
      items: {
        select: {
          images: {
            select: {
              objectKey: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const objectKeys = [
    user.profileKey,
    ...user.items.flatMap((item) => item.images.map((image) => image.objectKey)),
  ].filter((objectKey): objectKey is string => Boolean(objectKey));
  const uniqueObjectKeys = [...new Set(objectKeys)];

  if (uniqueObjectKeys.length > 0) {
    const bucketName = process.env.MINIO_BUCKET || "lost-found";

    try {
      const removalErrors = await request.server.minio.removeObjects(
        bucketName,
        uniqueObjectKeys,
      );

      if (removalErrors.length > 0) {
        request.log.error(
          { userId, removalErrors },
          "Failed to remove all account images from MinIO.",
        );
        throw new AppError("Failed to delete account images.", 500);
      }
    } catch (error) {
      request.log.error(error, "Failed to delete account images from MinIO.");
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to delete account images.", 500);
    }
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return reply.send({
    message: "Account deleted successfully!",
  });
}
