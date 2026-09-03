import { FastifyReply, FastifyRequest } from "fastify";
import { UserPosition } from "../generated/enums.js";
import { prisma } from "../lib/prisma.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { AppError } from "../errors/AppError.js";

export async function registerUser(
  request: FastifyRequest<{
    Body: {
      username: string;
      email: string;
      password: string;
      phone?: string;
      profileUrl?: string;
      lineUsername?: string;
      facebookUsername?: string;
      instagramUsername?: string;
      class?: string;
      position: UserPosition;
    };
  }>,
) {
  const {
    username,
    email,
    password,
    phone,
    profileUrl,
    lineUsername,
    facebookUsername,
    instagramUsername,
    class: userClass,
    position,
  } = request.body;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email,
        },
        {
          username,
        },
      ],
    },
  });

  if (existingUser) {
    throw new AppError("Email or username already registered", 409);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      phone,
      profileUrl,
      lineUsername,
      facebookUsername,
      instagramUsername,
      class: userClass,
      position,
    },
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    position: user.position,
    createdAt: user.createdAt,
  };
}

export async function loginUser(
  request: FastifyRequest<{
    Body: {
      email: string;
      password: string;
    };
  }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);

  if (!passwordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = await reply.jwtSign({
    userId: user.id,
    email: user.email,
  });

  return {
    token,
  };
}
