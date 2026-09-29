import { Type, type Static } from "@sinclair/typebox";

export const ItemListsRequestQuerySchema = Type.Object({
  search: Type.Optional(
    Type.String({
      minLength: 1,
    }),
  ),

  type: Type.Optional(
    Type.Union([Type.Literal("LOST"), Type.Literal("FOUND")]),
  ),

  status: Type.Optional(
    Type.Union([Type.Literal("OPEN"), Type.Literal("RESOLVED")]),
  ),

  category: Type.Optional(
    Type.String({
      minLength: 1,
    }),
  ),

  color: Type.Optional(
    Type.String({
      minLength: 1,
    }),
  ),

  fromDate: Type.Optional(
    Type.String({
      format: "date",
    }),
  ),

  toDate: Type.Optional(
    Type.String({
      format: "date",
    }),
  ),

  page: Type.Optional(
    Type.String({
      pattern: "^[0-9]+$",
    }),
  ),

  limit: Type.Optional(
    Type.String({
      pattern: "^[0-9]+$",
    }),
  ),
});

export type ItemListsRequestQuery = Static<typeof ItemListsRequestQuerySchema>;
