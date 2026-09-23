import type { FastifyReply, FastifyRequest } from "fastify";

import type { UserDeleteResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";

export async function userDeleteHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<UserDeleteResponseBody> {

    const userId = request.user.userId;

    await prisma.user.delete({
        where: {
            id: userId,
        }
    })

  return reply.send({
    message: "Account deleted successfully!",
  });
}
