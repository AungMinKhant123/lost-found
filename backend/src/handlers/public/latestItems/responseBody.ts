import { Type, type Static } from "@sinclair/typebox";

export const LatestItemSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  imageUrl: Type.String(),
  createdAt: Type.String(),
  type: Type.Union([Type.Literal("LOST"), Type.Literal("FOUND")]),
  status: Type.Union([Type.Literal("OPEN"), Type.Literal("RESOLVED")]),
});

export const LatestItemsResponseBodySchema = Type.Object({
  message: Type.String(),
  data: Type.Array(LatestItemSchema),
});

export type LatestItemsResponseBody = Static<
  typeof LatestItemsResponseBodySchema
>;
