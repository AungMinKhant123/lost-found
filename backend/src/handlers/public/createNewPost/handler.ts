import type { FastifyReply, FastifyRequest } from "fastify";

import type { CreateNewPostRequestBody } from "./requestBody.js";
import type { CreateNewPostResponseBody } from "./responseBody.js";

import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";

export async function createNewPostHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<CreateNewPostResponseBody> {
  const body = request.body as CreateNewPostRequestBody;

  // Get the authenticated user
  const userId = request.user.userId;

  // Check category
  const category = await prisma.category.findUnique({
    where: {
      id: body.categoryId,
    },
  });

  if (!category) {
    throw new AppError("Category not found!", 404);
  }

  // Check color
  const color = await prisma.color.findUnique({
    where: {
      id: body.colorId,
    },
  });

  if (!color) {
    throw new AppError("Color not found!", 404);
  }

  // Create the item
  await prisma.item.create({
    data: {
      userId,
      createdById: userId,
      updatedById: userId,

      type: body.type,
      title: body.title,
      categoryId: body.categoryId,
      location: body.location,
      colorId: body.colorId,
      dateLostOrFound: new Date(body.dateLostOrFound),
      description: body.description,
    },
  });

  // Save Cloudinary image URLs
  // if (body.images && body.images.length > 0) {
  //   await prisma.itemImage.createMany({
  //     data: body.images.map((imageUrl) => ({
  //       itemId: item.id,
  //       imageUrl,
  //     })),
  //   });
  // }

  return reply.send({
    message: "Post created successfully!",
  });
}
