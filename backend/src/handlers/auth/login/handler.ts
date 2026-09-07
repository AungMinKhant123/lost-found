import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";

import type { LoginRequestBody } from "./requestBody.js";
import type { LoginResponseBody } from "./responseBody.js";

import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";

export async function loginHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<LoginResponseBody> {
  const body = request.body as LoginRequestBody;

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  if (!user.isActive) {
    throw new AppError("User account is inactive", 403);
  }
  const isPasswordValid = await bcrypt.compare(
    body.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = await request.server.jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = await request.server.jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    {
      expiresIn: "7d",
    },
  );

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: {
      token: refreshTokenHash,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt,
    },
  });

  return reply.code(200).send({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
    },
  });
}
