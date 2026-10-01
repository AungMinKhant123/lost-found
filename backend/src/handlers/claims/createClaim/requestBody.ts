import { Type, type Static } from "@sinclair/typebox";

export const CreateClaimRequestBodySchema = Type.Object({
  itemId: Type.String({ format: "uuid" }),
  message: Type.String({ minLength: 1, maxLength: 2000 }),
});

export type CreateClaimRequestBody = Static<
  typeof CreateClaimRequestBodySchema
>;
