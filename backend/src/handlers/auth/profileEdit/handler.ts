import type { FastifyReply, FastifyRequest } from "fastify";

import type { ProfileEditRequestBody } from "./requestBody.js";

import type { ProfileEditResponseBody } from "./responseBody.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";

export async function profileEditHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<ProfileEditResponseBody> {
  const body = request.body as ProfileEditRequestBody;

  // Authentication is required.
  const userId = request.user.userId;
  // TODO: access authenticated user

  // TODO: implement business logic
  // extract the user data from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      //need to add social media
      profession: true,
      aboutMe: true,
    }
  });

  if(!user) {
    throw new AppError("User not found!", 404);
  }

  const nameParts = body.fullName.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice().join(" ");

  // insert user input data into database
  await prisma.user.update({
    where: { id: userId },
    data: {
      profileUrl: body.profileUrl,
      firstName,
      lastName,
      email: body.email,
      phone: body.phone,
      //need to add social media
      profession: body.profession,
      aboutMe: body.aboutMe,
    }
  });

  return reply.send({
    message: "Success",
  });
}
