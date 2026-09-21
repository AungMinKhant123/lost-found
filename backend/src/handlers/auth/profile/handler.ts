import type { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";
import { ProfileResponseBody } from "./responseBody.js";

export async function profileHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ProfileResponseBody> {
  console.log("request.user:", request.user);
  const userId = request.user.userId;

  // Get user information and statistics
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      profileUrl: true,
      socialMedia: true,
      profession: true,
      aboutMe: true,
      passwordUpdatedAt: true,

      _count: {
        select: {
          items: true,
          claims: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  // Calculate profile statistics
  const itemsFound = await prisma.item.count({
    where: {
      userId: userId,
      type: "FOUND",
    },
  });

  const itemsReturned = await prisma.item.count({
    where: {
      userId: userId,
      status: "RESOLVED",
    },
  });

  return reply.send({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    profileUrl: user.profileUrl,
    socialMedia: user.socialMedia,
    profession: user.profession,
    aboutMe: user.aboutMe,
    passwordUpdatedAt: user.passwordUpdatedAt,

    stats: {
      itemReports: user._count.items,
      itemsFound,
      claimsSubmitted: user._count.claims,
      itemsReturned,
    },
  });
}
