import { Type, type Static } from "@sinclair/typebox";
import { ItemStatus, ItemType } from "../../../generated/enums.js";

const MyPostItemSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  type: Type.Enum(ItemType),
  title: Type.String(),
  description: Type.Optional(Type.String()),
  location: Type.String(),
  dateLostOrFound: Type.String(),
  status: Type.Enum(ItemStatus),

  category: Type.Object({
    id: Type.String({ format: "uuid" }),
    name: Type.String(),
  }),

  color: Type.Object({
    id: Type.String({ format: "uuid" }),
    name: Type.String(),
  }),

  images: Type.Array(
    Type.Object({
      id: Type.String({ format: "uuid" }),
      objectKey: Type.String(),
    }),
  ),
});

export const MyPostsResponseBodySchema = Type.Object({
  data: Type.Array(MyPostItemSchema),

  pagination: Type.Object({
    page: Type.Number(),
    limit: Type.Number(),
    total: Type.Number(),
    totalPages: Type.Number(),
  }),
});

export type MyPostsResponseBody = Static<typeof MyPostsResponseBodySchema>;
