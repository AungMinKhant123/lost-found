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

const PendingClaimsQuerySchema = Type.Unsafe<"true" | "false">({
  type: "string",
  enum: ["true", "false"],
});

export const MyPostsRequestQuerySchema = Type.Object({
  type: Type.Optional(ItemTypeQuerySchema),
  status: Type.Optional(ItemStatusQuerySchema),
  pendingClaims: Type.Optional(PendingClaimsQuerySchema),
  page: Type.Optional(Type.String()),
  limit: Type.Optional(Type.String()),
});

export type MyPostsRequestQuery = Static<typeof MyPostsRequestQuerySchema>;
