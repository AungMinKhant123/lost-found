import { Type, type Static } from "@sinclair/typebox";

export const RefreshResponseBodySchema = Type.Object({
  message: Type.String(),
});

export type RefreshResponseBody = Static<typeof RefreshResponseBodySchema>;
