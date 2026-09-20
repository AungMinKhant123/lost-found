import type { FastifyReply, FastifyRequest } from "fastify";

import type { ProfileResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";

export async function profileHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ProfileResponseBody> {
  // Authentication is required.
  // Get the currently authenticated user
  const userId = request.user.userId;
  // TODO: access authenticated user

  // TODO: implement business logic
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
        lineUsername: true,
        facebookUsername: true,
        instagramUsername: true,
        profession: true,
        aboutMe: true,
        passwordUpdatedAt: true,

        _count: {
            select: {
                items: true,
                claims: true,
            }
        }
    }
  });

  if(!user) {
    throw new AppError("User not found!", 404);
  }

  // Calculate profile statistics
  const itemsFound = await prisma.item.count({
    where: {
        userId: userId,
        type: "FOUND",
    }
  });

  const itemsReturned = await prisma.item.count({
    where: {
        userId: userId,
        status: "RESOLVED",
    }
  })

  return reply.send({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    profileUrl: user.profileUrl,
    lineUsername: user.lineUsername,
    facebookUsername: user.facebookUsername,
    instagramUsername: user.instagramUsername,
    profession: user.profession,
    aboutMe: user.aboutMe,
    passwordUpdatedAt: user.passwordUpdatedAt,

    stats: {
        itemReports: user._count.items,
        itemsFound,
        claimsSubmitted: user._count.claims,
        itemsReturned,
    }
  });
}
