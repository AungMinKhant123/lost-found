import { Type, type Static } from "@sinclair/typebox";

const CategorySchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
  icon: Type.String(),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export const EditCategoryResponseBodySchema = Type.Object({
  data: CategorySchema,
});

export type EditCategoryResponseBody = Static<
  typeof EditCategoryResponseBodySchema
>;
