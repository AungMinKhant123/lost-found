import type { FastifyReply, FastifyRequest } from "fastify";

import type { LogoutResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";
import { createRefreshTokenLookup } from "../../../utils/refreshToken.js";
import { SYS_CONSTANTS } from "../../../constants/system.js";

export async function logoutHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<LogoutResponseBody> {
  const refreshToken = request.cookies[SYS_CONSTANTS.REFRESH_TOKEN_COOKIE];

  if (refreshToken) {
    const tokenLookup = createRefreshTokenLookup(refreshToken);

    const storedRefreshToken = await prisma.refreshToken.findUnique({
      where: {
        tokenLookup,
      },
    });

    if (storedRefreshToken) {
      await prisma.refreshToken.delete({
        where: {
          id: storedRefreshToken.id,
        },
      });
    }
  }

  reply.clearCookie(SYS_CONSTANTS.ACCESS_TOKEN_COOKIE, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  reply.clearCookie(SYS_CONSTANTS.REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  return reply.send({
    message: "Logout Success",
  });
}
