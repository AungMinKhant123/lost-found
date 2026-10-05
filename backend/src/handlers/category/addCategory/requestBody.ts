import { Type, type Static } from "@sinclair/typebox";

export const AddCategoryRequestBodySchema = Type.Object({
  name: Type.String({
    minLength: 1,
    maxLength: 100,
  }),

  icon: Type.String({
    minLength: 1,
    maxLength: 50,
  }),
});

export type AddCategoryRequestBody = Static<
  typeof AddCategoryRequestBodySchema
>;
