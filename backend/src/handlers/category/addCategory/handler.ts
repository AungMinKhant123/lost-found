import type { FastifyReply, FastifyRequest } from "fastify";

import type { AddCategoryRequestBody } from "./requestBody.js";

import { AppError } from "../../../errors/AppError.js";
import { Prisma } from "../../../generated/client.js";
import { prisma } from "../../../lib/prisma.js";
import type { AddCategoryResponseBody } from "./responseBody.js";

export async function addCategoryHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<AddCategoryResponseBody> {
  const body = request.body as AddCategoryRequestBody;

  const userId = request.user.userId;

  const name = body.name.trim();
  const icon = body.icon.trim();

  if (!name) {
    throw new AppError("Category name is required", 400);
  }

  if (!icon) {
    throw new AppError("Category name is required", 400);
  }

  try {
    const category = await prisma.category.create({
      data: {
        name,
        icon,
        createdById: userId,
        updatedById: userId,
      },
    });

    return reply.code(201).send({
      data: {
        id: category.id,
        name: category.name,
        icon: category.icon,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
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
