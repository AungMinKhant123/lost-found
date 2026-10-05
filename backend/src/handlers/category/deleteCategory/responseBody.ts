import { Type, type Static } from "@sinclair/typebox";

export const DeleteCategoryResponseBodySchema = Type.Object({
  message: Type.String(),
});

export type DeleteCategoryResponseBody = Static<
  typeof DeleteCategoryResponseBodySchema
>;
