import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";

import type { SignupRequestBody } from "./requestBody.js";
import type { SignupResponseBody } from "./responseBody.js";

import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";

export async function signupHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<SignupResponseBody> {
  const body = request.body as SignupRequestBody;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (existingUser) {
    throw new AppError("Email is already registered", 401);
  }

  const passwordHash = await bcrypt.hash(body.password, 12);

  await prisma.user.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      passwordHash,
      profession: body.profession,
    },
  });

  return reply.code(201).send({
    message: "Account created successfully",
  });
}
