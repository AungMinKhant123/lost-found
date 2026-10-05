import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import type { UpdateMyPostRequestBody } from "./requestBody.js";
import type { UpdateMyPostRequestParams } from "./requestParams.js";
import type { UpdateMyPostResponseBody } from "./responseBody.js";

export async function updateMyPostHandler(
  request: FastifyRequest<{
    Params: UpdateMyPostRequestParams;
    Body: UpdateMyPostRequestBody;
  }>,
  reply: FastifyReply,
): Promise<UpdateMyPostResponseBody> {
  const { itemId } = request.params;
  const {
    title,
    categoryId,
    colorId,
    location,
    dateLostOrFound,
    description,
  } = request.body;
  const userId = request.user.userId;

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { userId: true, status: true },
  });

  if (!item) {
    throw new AppError("Item not found.", 404);
  }

  if (item.userId !== userId) {
    throw new AppError("You are not allowed to update this post.", 403);
  }

  if (item.status !== "OPEN") {
    throw new AppError("Resolved posts can't be edited.", 409);
  }

  const [category, color] = await Promise.all([
    prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    }),
    colorId
      ? prisma.color.findUnique({
          where: { id: colorId },
          select: { id: true },
        })
      : Promise.resolve(null),
  ]);

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  if (colorId && !color) {
    throw new AppError("Color not found.", 404);
  }

  const date = new Date(`${dateLostOrFound}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new AppError("Invalid dateLostOrFound.", 400);
  }

  const updated = await prisma.item.updateMany({
    where: { id: itemId, userId, status: "OPEN" },
    data: {
      title,
      categoryId,
      ...(colorId ? { colorId } : {}),
      location,
      dateLostOrFound: date,
      description: description || null,
      updatedById: userId,
    },
  });

  if (updated.count === 0) {
    throw new AppError("This post can no longer be edited.", 409);
  }

  return reply.send({ message: "Post updated successfully." });
}
