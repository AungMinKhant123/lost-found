import { Type, type Static } from "@sinclair/typebox";
import { ItemStatus, ItemType } from "../../../generated/enums.js";

const ItemTypeQuerySchema = Type.Unsafe<ItemType>({
  type: "string",
  enum: ["LOST", "FOUND"],
});

const ItemStatusQuerySchema = Type.Unsafe<ItemStatus>({
  type: "string",
  enum: ["OPEN", "RESOLVED"],
});

export const ItemListsRequestQuerySchema = Type.Object({
  search: Type.Optional(Type.String()),

  type: Type.Optional(ItemTypeQuerySchema),

  status: Type.Optional(ItemStatusQuerySchema),

  category: Type.Optional(Type.String()),
  color: Type.Optional(Type.String()),

  fromDate: Type.Optional(Type.String()),
  toDate: Type.Optional(Type.String()),

  page: Type.Optional(Type.String()),
  limit: Type.Optional(Type.String()),
});

export type ItemListsRequestQuery =
  Static<typeof ItemListsRequestQuerySchema>;