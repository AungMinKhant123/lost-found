import { Type, type Static } from "@sinclair/typebox";
import { ItemStatus, ItemType } from "../../../generated/enums.js";

const ItemStatusQuerySchema = Type.Unsafe<ItemStatus>({
  type: "string",
  enum: ["OPEN", "RESOLVED"],
});

const ItemTypeQuerySchema = Type.Unsafe<ItemType>({
  type: "string",
  enum: ["LOST", "FOUND"],
});

export const ManageListingsRequestQuerySchema = Type.Object({
  search: Type.Optional(Type.String()),

  status: Type.Optional(ItemStatusQuerySchema),

  type: Type.Optional(ItemTypeQuerySchema),

  categoryId: Type.Optional(Type.String({ format: "uuid" })),

  page: Type.Optional(Type.String()),

  limit: Type.Optional(Type.String()),
});

export type ManageListingsRequestQuery = Static<
  typeof ManageListingsRequestQuerySchema
>;
