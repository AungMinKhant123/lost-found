import type { FastifyReply, FastifyRequest } from "fastify";

import { randomUUID } from "node:crypto";

import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";
import { CreateItemResponseBody } from "./responseBody.js";

export async function createItemHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<CreateItemResponseBody> {
  const userId = request.user.userId;

  let type: "LOST" | "FOUND" | undefined;
  let title: string | undefined;
  let categoryId: string | undefined;
  let location: string | undefined;
  let colorId: string | undefined;
  let dateLostOrFound: string | undefined;
  let description: string | undefined;

  const uploadedImages: {
    objectKey: string;
    contentType: string;
  }[] = [];

  for await (const part of request.parts()) {
    if (part.type === "file") {
      if (part.fieldname !== "images") {
        continue;
      }

      if (!part.mimetype.startsWith("image/")) {
        throw new AppError("Only image files are allowed.", 400);
      }

      const itemId = randomUUID();

      const objectKey = `items/${itemId}/${randomUUID()}-${part.filename}`;

      await request.server.minio.putObject(
        process.env.MINIO_BUCKET!,
        objectKey,
        part.file,
      );

      uploadedImages.push({
        objectKey,
        contentType: part.mimetype,
      });

      continue;
    }

    switch (part.fieldname) {
      case "type":
        type = part.value as "LOST" | "FOUND";
        break;

      case "title":
        title = part.value;
        break;

      case "categoryId":
        categoryId = part.value;
        break;

      case "location":
        location = part.value;
        break;

      case "colorId":
        colorId = part.value;
        break;

      case "dateLostOrFound":
        dateLostOrFound = part.value;
        break;

      case "description":
        description = part.value;
        break;
    }
  }

  if (
    !type ||
    !title ||
    !categoryId ||
    !location ||
    !colorId ||
    !dateLostOrFound
  ) {
    throw new AppError(
      "type, title, categoryId, location, colorId and dateLostOrFound are required.",
      400,
    );
  }

  if (type !== "LOST" && type !== "FOUND") {
    throw new AppError("Item type must be LOST or FOUND.", 400);
  }

  const date = new Date(dateLostOrFound);

  if (Number.isNaN(date.getTime())) {
    throw new AppError("Invalid dateLostOrFound.", 400);
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  const color = await prisma.color.findUnique({
    where: {
      id: colorId,
    },
  });

  if (!color) {
    throw new AppError("Color not found.", 404);
  }

  const item = await prisma.item.create({
    data: {
      userId,

      type,

      title,

      description: description || null,

      categoryId,

      location,

      colorId,

      dateLostOrFound: date,

      createdById: userId,

      updatedById: userId,

      images: {
        create: uploadedImages.map((image) => ({
          imageUrl: image.objectKey,
        })),
      },
    },

    include: {
      images: {
        select: {
          id: true,
          imageUrl: true,
        },
      },
    },
  });

  return reply.code(201).send({
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description,
    categoryId: item.categoryId,
    location: item.location,
    colorId: item.colorId,
    dateLostOrFound: item.dateLostOrFound.toISOString(),
    status: item.status,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),

    images: item.images,
  });
}
