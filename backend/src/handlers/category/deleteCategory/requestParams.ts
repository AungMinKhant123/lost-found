import { Type, type Static } from "@sinclair/typebox";

export const DeleteCategoryRequestParamsSchema = Type.Object({
  categoryId: Type.String({ format: "uuid" }),
});

export type DeleteCategoryRequestParams = Static<
  typeof DeleteCategoryRequestParamsSchema
>;
