import { Type, type Static } from "@sinclair/typebox";

export const RefreshResponseBodySchema = Type.Object({
  message: Type.String(),
  data: Type.Object({
    accessToken: Type.String(),
    refreshToken: Type.String(),
  }),
});

export type RefreshResponseBody = Static<typeof RefreshResponseBodySchema>;
