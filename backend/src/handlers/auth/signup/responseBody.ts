import { Type, type Static } from "@sinclair/typebox";

export const SignupResponseBodySchema = Type.Object({
  message: Type.String(),
});

export type SignupResponseBody = Static<typeof SignupResponseBodySchema>;
