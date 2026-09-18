import type { FastifyReply, FastifyRequest } from "fastify";

import type { RefreshResponseBody } from "./responseBody.js";

import {
  hashRefreshToken,
  verifyRefreshToken,
} from "../../../utils/refreshToken.js";

import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";
import { randomBytes } from "node:crypto";
import { SYS_CONSTANTS } from "../../../constants/system.js";

export async function refreshHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<RefreshResponseBody> {
  const refreshToken = request.cookies[SYS_CONSTANTS.REFRESH_TOKEN_COOKIE];

  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  const refreshTokenRecords = await prisma.refreshToken.findMany();

  let storedRefreshToken = null;

  for (const tokenRecord of refreshTokenRecords) {
    const isValid = await verifyRefreshToken(
      refreshToken,
      tokenRecord.tokenHash,
    );

    if (isValid) {
      storedRefreshToken = tokenRecord;
      break;
    }
  }

  if (!storedRefreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (storedRefreshToken.expiresAt <= new Date()) {
    await prisma.refreshToken.delete({
      where: {
        id: storedRefreshToken.id,
      },
    });

    throw new AppError("Refresh token has expired", 401);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: storedRefreshToken.userId,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const newAccessToken = await reply.jwtSign(
    {
      userId: user.id,
      email: user.email,
    },
    {
      expiresIn: "10s",
    },
  );

  const newRefreshToken = randomBytes(64).toString("hex");

  const newRefreshTokenExpiresAt = new Date();

  newRefreshTokenExpiresAt.setDate(newRefreshTokenExpiresAt.getDate() + 7);

  const newRefreshTokenHash = await hashRefreshToken(newRefreshToken);

  await prisma.$transaction([
    prisma.refreshToken.delete({
      where: {
        id: storedRefreshToken.id,
      },
    }),

    prisma.refreshToken.create({
      data: {
        tokenHash: newRefreshTokenHash,
        userId: user.id,
        expiresAt: newRefreshTokenExpiresAt,
      },
    }),
  ]);

  reply.setCookie(SYS_CONSTANTS.ACCESS_TOKEN_COOKIE, newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 15,
    path: "/",
  });
  reply.setCookie(SYS_CONSTANTS.REFRESH_TOKEN_COOKIE, newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return reply.send({
    message: "Token refreshed successfully",
  });
}
