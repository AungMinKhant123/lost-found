import { Type } from "@sinclair/typebox";

export const CreateItemResponseBodySchema = Type.Object({
  id: Type.String(),
  type: Type.Union([Type.Literal("LOST"), Type.Literal("FOUND")]),
  title: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  categoryId: Type.String(),
  location: Type.String(),
  colorId: Type.String(),
  dateLostOrFound: Type.String(),
  status: Type.Union([Type.Literal("OPEN"), Type.Literal("RESOLVED")]),
  createdAt: Type.String(),
  updatedAt: Type.String(),

  images: Type.Array(
    Type.Object({
      id: Type.String(),
      objectKey: Type.String(),
    }),
  ),
});

export type CreateItemResponseBody = typeof CreateItemResponseBodySchema.static;
