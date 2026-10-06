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
      userId,
    },
    select: {
      id: true,
      images: {
        select: {
          objectKey: true,
        },
      },
    },
  });

  if (!item) {
    throw new AppError("Item not found!", 404);
  }

  if (item.images.length > 0) {
    const bucketName = process.env.MINIO_BUCKET || "lost-found";
    const removalErrors = await request.server.minio.removeObjects(
      bucketName,
      item.images.map((image) => image.objectKey),
    );

    if (removalErrors.length > 0) {
      request.log.error(
        { itemId, failedImageCount: removalErrors.length },
        "Failed to delete one or more post images from MinIO.",
      );
      throw new AppError("Failed to delete post images.", 500);
    }
  }

  await prisma.item.delete({
    where: {
      id: itemId,
    },
  });

  return reply.send({
    message: "This post is successfully deleted.",
  });
}
