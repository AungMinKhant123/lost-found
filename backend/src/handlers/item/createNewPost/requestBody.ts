import { Type } from "@sinclair/typebox";

export const CreateItemRequestBodySchema = Type.Object({
  type: Type.Union([Type.Literal("LOST"), Type.Literal("FOUND")]),

  title: Type.String({
    minLength: 1,
    maxLength: 200,
  }),

  categoryId: Type.String({
    minLength: 1,
  }),

  location: Type.String({
    minLength: 1,
    maxLength: 255,
  }),

  colorId: Type.String({
    minLength: 1,
  }),

  dateLostOrFound: Type.String({
    minLength: 1,
  }),

  description: Type.Optional(
    Type.String({
      maxLength: 2000,
    }),
  ),
});
