import { Type, type Static } from "@sinclair/typebox";

export const ManageColorRequestBodySchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 100 }),
  hexCode: Type.String({ pattern: "^#[0-9A-Fa-f]{6}$" }),
});

export type ManageColorRequestBody = Static<
  typeof ManageColorRequestBodySchema
>;
