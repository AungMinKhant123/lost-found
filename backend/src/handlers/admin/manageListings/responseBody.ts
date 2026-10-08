import { Type, type Static } from "@sinclair/typebox";
import { ItemStatus, ItemType } from "../../../generated/enums.js";

const ManageListingItemSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  title: Type.String(),
  type: Type.Enum(ItemType),
  status: Type.Enum(ItemStatus),
  createdAt: Type.String({
    format: "date-time",
  }),

  category: Type.Object({
    id: Type.String({ format: "uuid" }),
    name: Type.String(),
  }),

  color: Type.Object({
    id: Type.String({ format: "uuid" }),
    name: Type.String(),
  }),

  user: Type.Object({
    id: Type.String({ format: "uuid" }),
    firstName: Type.String(),
    lastName: Type.String(),
  }),
});

export const ManageListingsResponseBodySchema =
  Type.Object({
    data: Type.Array(
      ManageListingItemSchema,
    ),

    pagination: Type.Object({
      page: Type.Number(),
      limit: Type.Number(),
      total: Type.Number(),
      totalPages: Type.Number(),
    }),
  });

export type ManageListingsResponseBody =
  Static<typeof ManageListingsResponseBodySchema>;