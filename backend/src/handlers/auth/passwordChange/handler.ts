import type { FastifyReply, FastifyRequest } from "fastify";

import type { PasswordChangeRequestBody } from "./requestBody.js";
import type { PasswordChangeResponseBody } from "./responseBody.js";

import { AppError } from "../../../errors/AppError.js";
import { hashPassword, verifyPassword } from "../../../utils/password.js";
import {
  createRefreshTokenLookup,
  hashRefreshToken,
} from "../../../utils/refreshToken.js";
import { prisma } from "../../../lib/prisma.js";
import { randomBytes } from "node:crypto";
import { SYS_CONSTANTS } from "../../../constants/system.js";

export async function passwordChangeHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<PasswordChangeResponseBody> {
  const body = request.body as PasswordChangeRequestBody;

  const { currentPassword, newPassword, newPassConfirm } = body;

  const userId = request.user.userId;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  const isPasswordCorrect = await verifyPassword(
    currentPassword,
    user.passwordHash,
  );

  if (!isPasswordCorrect) {
    throw new AppError("Current password is incorrect!", 401);
  }

  if (newPassword !== newPassConfirm) {
    throw new AppError("New passwords do not match!", 400);
  }

  const isSamePassword = await verifyPassword(newPassword, user.passwordHash);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from your current password!",
      400,
    );
  }

  const passwordHash = await hashPassword(newPassword);

  const newAccessToken = await reply.jwtSign(
    {
      userId: user.id,
      email: user.email,
    },
    {
      expiresIn: "15m",
    },
  );

  const newRefreshToken = randomBytes(64).toString("hex");

  const newRefreshTokenExpiresAt = new Date();

  newRefreshTokenExpiresAt.setDate(newRefreshTokenExpiresAt.getDate() + 7);

  const newRefreshTokenLookup = createRefreshTokenLookup(newRefreshToken);

  const newRefreshTokenHash = await hashRefreshToken(newRefreshToken);

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
        passwordUpdatedAt: new Date(),
      },
    }),

    prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    }),

    prisma.refreshToken.create({
      data: {
        tokenLookup: newRefreshTokenLookup,
        tokenHash: newRefreshTokenHash,
        userId,
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
    message: "Password updated successfully!",
  });
}
