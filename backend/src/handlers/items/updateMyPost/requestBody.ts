import { Type, type Static } from "@sinclair/typebox";

export const UpdateMyPostRequestBodySchema = Type.Object({
  title: Type.String({ minLength: 1, maxLength: 200 }),
  categoryId: Type.String({ format: "uuid" }),
  colorId: Type.Optional(Type.String({ format: "uuid" })),
  location: Type.String({ minLength: 1, maxLength: 255 }),
  dateLostOrFound: Type.String({ format: "date" }),
  description: Type.String({ maxLength: 2000 }),
});

export type UpdateMyPostRequestBody = Static<
  typeof UpdateMyPostRequestBodySchema
>;
