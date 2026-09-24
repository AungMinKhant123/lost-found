import { Type, type Static } from "@sinclair/typebox";
import { ItemStatus, ItemType } from "../../../generated/enums.js";

const ItemTypeQuerySchema  = Type.Unsafe<ItemType>({
  type: "string",
  enum: ["LOST", "FOUND"]
})

const ItemStatusQuerySchema  = Type.Unsafe<ItemStatus>({
  type: "string",
  enum: ["OPEN", "RESOLVED"]
})

export const MyPostsRequestQuerySchema = Type.Object({
  type: Type.Optional(ItemTypeQuerySchema),
  status: Type.Optional(ItemStatusQuerySchema),
  page: Type.Optional(Type.String()),
  limit: Type.Optional(Type.String()),
});

export type MyPostsRequestQuery = Static<typeof MyPostsRequestQuerySchema>;
