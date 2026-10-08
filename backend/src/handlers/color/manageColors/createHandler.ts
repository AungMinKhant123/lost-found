import type { FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "../../../generated/client.js";
import { AppError } from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import type { ManageColorRequestBody } from "./requestBody.js";
import type { ManageColorResponseBody } from "./responseBody.js";

export async function createColorHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ManageColorResponseBody> {
  const { name: inputName, hexCode } =
    request.body as ManageColorRequestBody;
  const name = inputName.trim();

  if (!name) {
    throw new AppError("Color name is required.", 400);
  }

  try {
    const color = await prisma.color.create({
      data: {
        name,
        hexCode,
        createdById: request.user.userId,
        updatedById: request.user.userId,
      },
    });

    return reply.code(201).send({
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
    throw error;
  }
}
