import { Type, type Static } from "@sinclair/typebox";

export const LogoutResponseBodySchema = Type.Object({
  message: Type.String(),
});

export type LogoutResponseBody = Static<typeof LogoutResponseBodySchema>;
