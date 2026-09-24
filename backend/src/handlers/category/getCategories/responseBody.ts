import { Type, type Static } from "@sinclair/typebox";

export const GetCategoriesResponseBodySchema = Type.Array(
  Type.Object({
    id: Type.String(),
    name: Type.String(),
  }),
);

export type GetCategoriesResponseBody = Static<
  typeof GetCategoriesResponseBodySchema
>;
