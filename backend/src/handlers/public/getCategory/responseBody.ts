import { Type, type Static } from "@sinclair/typebox";

export const GetCategoryResponseBodySchema = Type.Object({
  data: Type.Array(
    Type.Object({
      id: Type.String({ format: "uuid" }),
      name: Type.String(),
    }),
  ),
});

export type GetCategoryResponseBody = Static<
  typeof GetCategoryResponseBodySchema
>;
