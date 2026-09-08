import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";

import type { SignupRequestBody } from "./requestBody.js";
import type { SignupResponseBody } from "./responseBody.js";

import { PrismaClient } from "../../../generated/client.js";
import { AppError } from "../../../errors/AppError.js";

const prisma = new PrismaClient();

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

  const passwordHash = await bcrypt.hash(password, 10);

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