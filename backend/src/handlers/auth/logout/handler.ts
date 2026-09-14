import type { FastifyReply, FastifyRequest } from "fastify";

import type { LogoutResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";

export async function logoutHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<LogoutResponseBody> {

  const { userId } = request.user;

  await prisma.refreshToken.deleteMany({ where: {userId}});

  return reply.send({
    message: "Logout Success",
  });
}
