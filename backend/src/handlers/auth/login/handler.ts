import type { FastifyReply, FastifyRequest } from "fastify";

import type { LoginRequestBody } from "./requestBody.js";

import type { LoginResponseBody } from "./responseBody.js";
import { AppError } from "../../../errors/AppError.js";


import { randomBytes } from "node:crypto";
import { prisma } from "../../../lib/prisma.js";
import { verifyPassword } from "../../../utils/password.js";
import { hashRefreshToken } from "../../../utils/refreshToken.js";
import { SYS_CONSTANTS } from "../../../constants/system.js";

export async function loginHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<LoginResponseBody> {
  const body = request.body as LoginRequestBody;

  const { email, password } = body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await verifyPassword(password, user.passwordHash);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = await reply.jwtSign(
    {
      userId: user.id,
      email: user.email,
    },
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = randomBytes(64).toString("hex");
  const refreshTokenExpiresAt = new Date();
  refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

  const refreshTokenHash = await hashRefreshToken(refreshToken);
  await prisma.refreshToken.create({
    data: {
      token: refreshTokenHash,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt,
    },
  });

  reply.setCookie(SYS_CONSTANTS.ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 15,
    path: "/",
  });

  reply.setCookie(SYS_CONSTANTS.REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return reply.send({
    message: "Login successful",
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    },
    refreshToken: refreshToken, //need to delete, only for testing
    accessToken: accessToken, //need to delete, only for testing
  });
}
