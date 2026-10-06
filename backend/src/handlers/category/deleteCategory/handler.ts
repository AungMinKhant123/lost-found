import type { FastifyReply, FastifyRequest } from "fastify";

import type { DeleteCategoryRequestParams } from "./requestParams.js";

import type { DeleteCategoryResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";

export async function deleteCategoryHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<DeleteCategoryResponseBody> {
  const { categoryId } = request.params as DeleteCategoryRequestParams;

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new AppError("Category not found!", 404);
  }

  const itemCount = await prisma.item.count({
    where: {
      categoryId,
    },
  });

  if (itemCount > 0) {
    throw new AppError(
      "Cannot delete this category because it is being used by one or more items.",
      409,
    );
  }

  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  return reply.send({
    message: "Category deleted successfully.",
  });
}
