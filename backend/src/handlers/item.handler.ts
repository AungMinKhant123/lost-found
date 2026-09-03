import { FastifyReply, FastifyRequest } from "fastify";
import { ItemType } from "../generated/enums.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";

type CreateItemBody = {
  type: ItemType;
  title: string;
  description?: string;
  categoryId: string;
  location: string;
  colorId: string;
  dateLostOrFound: string;
  imageUrls?: string[];
};

export async function createItem(
  request: FastifyRequest<{
    Body: CreateItemBody;
  }>,
  reply: FastifyReply,
) {
  const {
    type,
    title,
    description,
    categoryId,
    location,
    colorId,
    dateLostOrFound,
    imageUrls = [],
  } = request.body;
  const userId = request.user.userId;

  const date = new Date(dateLostOrFound);
  if (Number.isNaN(date.getTime())) {
    throw new AppError("dateLostOrFound must be a valid date", 400);
  }

  const [category, color] = await Promise.all([
    prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    }),
    prisma.color.findUnique({
      where: {
        id: colorId,
      },
    }),
  ]);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  if (!color) {
    throw new AppError("Color not found", 404);
  }

  const item = await prisma.item.create({
    data: {
      userId,
      type,
      title,
      description,
      categoryId,
      location,
      colorId,
      dateLostOrFound: date,
      createdById: userId,
      updatedById: userId,
      images: {
        create: imageUrls.map((imageUrl) => ({
          imageUrl,
        })),
      },
    },
    include: {
      images: true,
    },
  });

  return reply.status(201).send(item);
}
