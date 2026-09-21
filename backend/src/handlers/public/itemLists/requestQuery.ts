import { Type, type Static } from "@sinclair/typebox";
import { ItemStatus, ItemType } from "../../../generated/enums.js";

export const ItemListsRequestQuerySchema = Type.Object({
  search: Type.Optional(Type.String()),

  type: Type.Optional(Type.Enum(ItemType)),

  status: Type.Optional(Type.Enum(ItemStatus)),

  category: Type.Optional(Type.String()),
  color: Type.Optional(Type.String()),

  fromDate: Type.Optional(Type.String()),
  toDate: Type.Optional(Type.String()),

  page: Type.Optional(Type.String()),
  limit: Type.Optional(Type.String()),
});

export type ItemListsRequestQuery = Static<typeof ItemListsRequestQuerySchema>;
