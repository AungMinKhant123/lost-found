import { Type, type Static } from "@sinclair/typebox";

export const LoginResponseBodySchema = Type.Object({
  message: Type.String(),
  accessToken: Type.String(),
  refreshToken: Type.String(),
});

export type LoginResponseBody = Static<typeof LoginResponseBodySchema>;
