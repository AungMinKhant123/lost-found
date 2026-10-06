import { Type, type Static } from "@sinclair/typebox";

export const EditCategoryRequestBodySchema = Type.Object({
  name: Type.String({
    minLength: 1,
    maxLength: 100,
  }),

  icon: Type.String({
    minLength: 1,
    maxLength: 50,
  }),
});

export type EditCategoryRequestBody = Static<
  typeof EditCategoryRequestBodySchema
>;
