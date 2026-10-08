import { Type, type Static } from "@sinclair/typebox";

export const GetCategoriesResponseBodySchema = Type.Array(
  Type.Object({
    id: Type.String(),
    name: Type.String(),
    icon: Type.String(),
    itemCount: Type.Number(),
  }),
);

export type GetCategoriesResponseBody = Static<
  typeof GetCategoriesResponseBodySchema
>;
