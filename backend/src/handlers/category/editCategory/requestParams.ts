import { Type, type Static } from "@sinclair/typebox";

export const EditCategoryRequestParamsSchema = Type.Object({
  categoryId: Type.String({ format: "uuid" }),
});

export type EditCategoryRequestParams = Static<
  typeof EditCategoryRequestParamsSchema
>;
