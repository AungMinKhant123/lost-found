import type { FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "../../../generated/client.js";
import { AppError } from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import type { ManageColorRequestBody } from "./requestBody.js";
import type { ManageColorRequestParams } from "./requestParams.js";
import type { ManageColorResponseBody } from "./responseBody.js";

export async function updateColorHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ManageColorResponseBody> {
  const { colorId } = request.params as ManageColorRequestParams;
  const { name: inputName, hexCode } =
    request.body as ManageColorRequestBody;
  const name = inputName.trim();

  if (!name) {
    throw new AppError("Color name is required.", 400);
  }

  try {
    const color = await prisma.color.update({
      where: { id: colorId },
      data: {
        name,
        hexCode,
        updatedById: request.user.userId,
      },
    });

    return reply.send({
      data: {
        id: color.id,
        name: color.name,
        hexCode: color.hexCode,
        createdAt: color.createdAt.toISOString(),
        updatedAt: color.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError("Color name already exists.", 409);
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new AppError("Color not found!", 404);
    }
    throw error;
  }
}
