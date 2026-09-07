import { Type, type Static } from "@sinclair/typebox";

export const LoginRequestBodySchema = Type.Object({
  email: Type.String({
    format: "email",
    description: "User email address",
  }),
  password: Type.String({ minLength: 8, description: "User password" }),
});

export type LoginRequestBody = Static<typeof LoginRequestBodySchema>;
