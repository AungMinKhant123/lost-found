import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import type { ManageColorRequestParams } from "./requestParams.js";
import type { DeleteColorResponseBody } from "./responseBody.js";

export async function deleteColorHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<DeleteColorResponseBody> {
  const { colorId } = request.params as ManageColorRequestParams;
  const color = await prisma.color.findUnique({
    where: { id: colorId },
  });

  if (!color) {
    throw new AppError("Color not found!", 404);
  }

  const itemCount = await prisma.item.count({
    where: { colorId },
  });

  if (itemCount > 0) {
    throw new AppError(
      "Cannot delete this color because it is being used by one or more items.",
      409,
    );
  }

  await prisma.color.delete({
    where: { id: colorId },
  });

  return reply.send({
    message: "Color deleted successfully.",
  });
}
