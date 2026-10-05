import type { FastifyReply, FastifyRequest } from "fastify";

import type { EditCategoryRequestParams } from "./requestParams.js";

import type { EditCategoryRequestBody } from "./requestBody.js";

import type { EditCategoryResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";
import { Prisma } from "../../../generated/client.js";

export async function editCategoryHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<EditCategoryResponseBody> {
  const { categoryId } = request.params as EditCategoryRequestParams;

  const body = request.body as EditCategoryRequestBody;

  const userId = request.user.userId;

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new AppError("Category not found!", 404);
  }

  const name = body.name.trim();
  const icon = body.icon.trim();

  if (!name) {
    throw new AppError("Category name is required.", 400);
  }

  if (!icon) {
    throw new AppError("Category name is required.", 400);
  }

  try {
    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },

      data: {
        name,
        icon,
        updatedById: userId,
      },
    });

    return reply.send({
      data: {
        id: updatedCategory.id,
        name: updatedCategory.name,
        icon: updatedCategory.icon,
        createdAt: updatedCategory.createdAt.toISOString(),
        updatedAt: updatedCategory.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError("Category name already exists.", 409);
    }

    throw error;
  }
}
