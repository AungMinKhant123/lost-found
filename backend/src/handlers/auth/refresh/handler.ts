import type { FastifyReply, FastifyRequest } from "fastify";

import type { RefreshRequestBody } from "./requestBody.js";

import type { RefreshResponseBody } from "./responseBody.js";
import { hashRefreshToken, verifyRefreshToken } from "../../../utils/refreshToken.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";
import { randomBytes } from "node:crypto";

export async function refreshHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<RefreshResponseBody> {
  const body = request.body as RefreshRequestBody;

  const { refreshToken } = body;

  // hash the refresh token sent by the client
  const refreshTokenRecords = await prisma.refreshToken.findMany();

  let storedRefreshToken = null;

  // find the refresh token in the database
  for(const tokenRecord of refreshTokenRecords) {
    const isValid = await verifyRefreshToken(
      refreshToken,
      tokenRecord.token,
    )

    if(isValid) {
      storedRefreshToken = tokenRecord;
      break;
    }
  }

  //if token doesn't exist, it may have been revoded or logged out, throw error
  if (!storedRefreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  //check whether the refresh token has expired
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
    }
  })

  if(!user) {
    throw new AppError("User not found", 404);
  }

  // Generate a new access token
  const newAccessToken = await reply.jwtSign(
    {
      userId: user.id,
      email: user.email,
    },
    {
      expiresIn: "15m",
    },
  );

  // Generate a new refresh token
  const newRefreshToken = randomBytes(64).toString("hex");

  const newRefreshTokenExpiresAt = new Date();
  newRefreshTokenExpiresAt.setDate(
    newRefreshTokenExpiresAt.getDate() + 7,
  );

  const newRefreshTokenHash = await hashRefreshToken(newRefreshToken);

  // Replace the old refresh token with the new one
  await prisma.$transaction([
    prisma.refreshToken.delete({
      where: {
        id: storedRefreshToken.id,
      },
    }),

    prisma.refreshToken.create({
      data: {
        token: newRefreshTokenHash,
        userId: user.id,
        expiresAt: newRefreshTokenExpiresAt,
      },
    }),
  ]);

  return reply.send({
    message: "Success",
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  });
}
