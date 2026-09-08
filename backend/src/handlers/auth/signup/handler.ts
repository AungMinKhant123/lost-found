import type { FastifyReply, FastifyRequest } from "fastify";

import type { SignupRequestBody } from "./requestBody.js";
import type { SignupResponseBody } from "./responseBody.js";

import { AppError } from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import { hashPassword } from "../../../utils/password.js";

export async function signupHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<SignupResponseBody> {
  const body = request.body as SignupRequestBody;

  const { firstName, lastName, email, password, phone, profession } = body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    throw new AppError("User already exists!", 409);
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      phone,
      profession,
    },
  });

  return reply.send({
    message: "Success",
  });
}
