import type { FastifyReply, FastifyRequest } from "fastify";

import { randomUUID } from "node:crypto";

import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../errors/AppError.js";
import { CreateItemResponseBody } from "./responseBody.js";

function getStringValue(value: unknown): string {
  if (typeof value !== "string") {
    throw new AppError("Invalid multipart field value.", 400);
  }

  return value;
}

export async function createItemHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<CreateItemResponseBody> {
  const userId = request.user.userId;

  // Generate the Item ID ONCE.
  // This same ID will be used by Prisma and MinIO.
  const itemId = randomUUID();

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
    // Handle uploaded files
    if (part.type === "file") {
      if (part.fieldname !== "images") {
        continue;
      }

      if (!part.mimetype.startsWith("image/")) {
        throw new AppError("Only image files are allowed.", 400);
      }

      // Use the SAME itemId for every image.
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

    // Handle normal multipart fields
    const value = getStringValue(part.value);

    switch (part.fieldname) {
      case "type":
        if (value !== "LOST" && value !== "FOUND") {
          throw new AppError("Item type must be LOST or FOUND.", 400);
        }

        type = value;
        break;

      case "title":
        title = value;
        break;

      case "categoryId":
        categoryId = value;
        break;

      case "location":
        location = value;
        break;

      case "colorId":
        colorId = value;
        break;

      case "dateLostOrFound":
        dateLostOrFound = value;
        break;

      case "description":
        description = value;
        break;
    }
  }

  // Validate required fields
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

  // Validate date
  const date = new Date(dateLostOrFound);

  if (Number.isNaN(date.getTime())) {
    throw new AppError("Invalid dateLostOrFound.", 400);
  }

  // Check category exists
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  // Check color exists
  const color = await prisma.color.findUnique({
    where: {
      id: colorId,
    },
  });

  if (!color) {
    throw new AppError("Color not found.", 404);
  }

  // Create Item using the SAME itemId used by MinIO.
  const item = await prisma.item.create({
    data: {
      id: itemId,

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
          objectKey: image.objectKey,
        })),
      },
    },

    include: {
      images: {
        select: {
          id: true,
          objectKey: true,
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
