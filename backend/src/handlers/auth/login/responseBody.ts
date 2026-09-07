import { Type, type Static } from "@sinclair/typebox";

export const LoginResponseBodySchema = Type.Object({
  accessToken: Type.String({ description: "Short-lived access token" }),
  refreshToken: Type.String({ description: "Long-lived refresh token" }),
  user: Type.Object({
    id: Type.String(),
    email: Type.String({ format: "email" }),
  }),
});

export type LoginResponseBody = Static<typeof LoginResponseBodySchema>;
