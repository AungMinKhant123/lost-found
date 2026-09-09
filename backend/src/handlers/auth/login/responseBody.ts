import { Type, type Static } from "@sinclair/typebox";

export const LoginResponseBodySchema = Type.Object({
  message: Type.String(),
  data: Type.Object({
    user: Type.Object({
      id: Type.String(),
      email: Type.String(),
      firstName: Type.String(),
      lastName: Type.String(),
      role: Type.String(),
    }),
    accessToken: Type.String(),
    refreshToken: Type.String(),
  }),
});

export type LoginResponseBody = Static<typeof LoginResponseBodySchema>;
