import { Type, type Static } from "@sinclair/typebox";

export const LoginRequestBodySchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8 }),
});

export type LoginRequestBody = Static<typeof LoginRequestBodySchema>;
