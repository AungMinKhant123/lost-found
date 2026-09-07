import { Type, type Static } from "@sinclair/typebox";

export const SignupRequestBodySchema = Type.Object(
  {
    firstName: Type.String({
      minLength: 3,
      maxLength: 50,
      description: "First name",
    }),

    lastName: Type.String({
      minLength: 3,
      maxLength: 50,
      description: "Last name",
    }),

    email: Type.String({
      format: "email",
      description: "User email address",
    }),

    phone: Type.String({
      minLength: 8,
      maxLength: 20,
      description: "User phone number",
    }),

    password: Type.String({
      minLength: 8,
      maxLength: 100,
      description: "User password",
    }),

    profession: Type.Union([
      Type.Literal("STUDENT"),
      Type.Literal("TEACHER"),
      Type.Literal("WORKER"),
    ]),
  },
  {
    additionalProperties: false,
  },
);

export type SignupRequestBody = Static<typeof SignupRequestBodySchema>;
