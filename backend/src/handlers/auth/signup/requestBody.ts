import { Type, type Static } from "@sinclair/typebox";
import { UserProfession } from "../../../generated/enums.js";

export const SignupRequestBodySchema = Type.Object({
  firstName: Type.String(),
  lastName: Type.String(),
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8 }),
  phone: Type.String(),
  profession: Type.Enum(UserProfession),
});

export type SignupRequestBody = Static<typeof SignupRequestBodySchema>;
