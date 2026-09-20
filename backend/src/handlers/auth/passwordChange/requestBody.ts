import { Type, type Static } from "@sinclair/typebox";

export const PasswordChangeRequestBodySchema = Type.Object({
  currentPassword: Type.String({ minLength: 8 }),
  newPassword: Type.String({ minLength: 8 }),
  newPassConfirm: Type.String({ minLength: 8 }),
});

export type PasswordChangeRequestBody = Static<
  typeof PasswordChangeRequestBodySchema
>;
