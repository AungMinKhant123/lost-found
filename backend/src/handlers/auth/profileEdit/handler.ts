import type { FastifyReply, FastifyRequest } from "fastify";

import type { ProfileEditRequestBody } from "./requestBody.js";

import type { ProfileEditResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";
import { Prisma } from "../../../generated/client.js";

export async function profileEditHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ProfileEditResponseBody> {
  const body = request.body as ProfileEditRequestBody;

  const userId = request.user.userId;

  const nameParts = body.fullName.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  //check whether the email is already used by another user
  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    }, 
    select: {
      id: true,
    }
  });

  if(existingUser && existingUser.id !== userId) {
    throw new AppError("Email is already in use.", 400);
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName,
        lastName,
        email: body.email,

        ...(body.profileKey !== undefined && {
          profileKey: body.profileKey,
        }),

        ...(body.phone !== undefined && {
          phone: body.phone,
        }),

        ...(body.socialMedia !== undefined && {
          socialMedia: body.socialMedia,
        }),

        ...(body.profession !== undefined && {
          profession: body.profession === "" ? null : body.profession,
        }),

        ...(body.aboutMe !== undefined && {
          aboutMe: body.aboutMe,
        }),
      }
    })
  } catch (error) {
    //have to handle duplicate email in case another request uses it
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new AppError("Email is already in use.", 400);
    }
    throw error;
  }

  return reply.send({
    message: "Profile updated successfully!",
  });
}
