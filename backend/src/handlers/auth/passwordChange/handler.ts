import type { FastifyReply, FastifyRequest } from "fastify";

import type { PasswordChangeRequestBody } from "./requestBody.js";

import type { PasswordChangeResponseBody } from "./responseBody.js";
import { AppError } from "../../../errors/AppError.js";
import { hashPassword, verifyPassword } from "../../../utils/password.js";
import { prisma } from "../../../lib/prisma.js";

export async function passwordChangeHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<PasswordChangeResponseBody> {
  const body = request.body as PasswordChangeRequestBody;

  const { currentPassword, newPassword, newPassConfirm } = body;

  // user comes from the JWT
  const userId = request.user.userId;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  //check current password
  const isPasswordCorrect = await verifyPassword(
    currentPassword,
    user.passwordHash,
  );

  if(!isPasswordCorrect) {
    throw new AppError("Current password is incorrect!", 401);
  }

  //check confirmation
  if(newPassword !== newPassConfirm) {
    throw new AppError("New passwords do not match!", 400);
  }

  //hash newPassword
  const passwordHash = await hashPassword(newPassword);

  //update passwordHash in database
  await prisma.user.update({
    where: {
        id: userId,
    },
    data: {
        passwordHash,
        passwordUpdatedAt: new Date(),
    }
  })

  return reply.send({
    message: "Password Updated Successfully!",
  });
}
