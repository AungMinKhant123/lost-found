import type { FastifyReply, FastifyRequest } from "fastify";

import type { LoginRequestBody } from "./requestBody.js";

import type { LoginResponseBody } from "./responseBody.js";
import { PrismaClient } from "../../../generated/client.js";
import { AppError } from "../../../errors/AppError.js";
import { compareSync } from "bcrypt";
import { randomBytes } from "node:crypto";

const prisma = new PrismaClient();

export async function loginHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<LoginResponseBody> {
  const body = request.body as LoginRequestBody;

  const { email, password } = body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  if (!compareSync(password, user.passwordHash)) {
    throw new AppError("Incorrect password!", 401);
  }

  const accessToken = await reply.jwtSign(
    {
      userId: user.id,
      email: user.email
    },
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = randomBytes(64).toString("hex");

  const refreshTokenExpiresAt = new Date();

  refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt,
    },
  });

  return reply.send({
    message: "Success",
    accessToken,
    refreshToken
  });
}
