import { Type, type Static } from "@sinclair/typebox";

export const PasswordChangeResponseBodySchema = Type.Object({
  message: Type.String(),
});

export type PasswordChangeResponseBody = Static<
  typeof PasswordChangeResponseBodySchema
>;
