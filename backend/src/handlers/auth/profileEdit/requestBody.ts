import { Type, type Static } from "@sinclair/typebox";
import { UserProfession } from "../../../generated/enums.js";

export const ProfileEditRequestBodySchema = Type.Object({
  profileKey: Type.Optional(Type.String()),
  fullName: Type.String({ minLength: 1 }),
  email: Type.String({ format: "email" }),
  phone: Type.Optional(Type.String()),

  socialMedia: Type.Optional(Type.String()),
  profession: Type.Optional(
    Type.Union([
      Type.Unsafe<UserProfession>({
      type: "string",
      enum: ["STUDENT", "TEACHER", "WORKER"],
    }),
    Type.Literal(""),
    ])
  ),
  aboutMe: Type.Optional(Type.String()),
});

export type ProfileEditRequestBody = Static<
  typeof ProfileEditRequestBodySchema
>;
