import { Type, type Static } from "@sinclair/typebox";
import { UserProfession } from "../../../generated/enums.js";

export const ProfileEditRequestBodySchema = Type.Object({
  fullName: Type.String({
    minLength: 1,
  }),

  phone: Type.Optional(Type.String()),

  socialMedia: Type.Optional(Type.String()),

  profession: Type.Optional(Type.Enum(UserProfession)),

  aboutMe: Type.Optional(Type.String()),
});

export type ProfileEditRequestBody = Static<
  typeof ProfileEditRequestBodySchema
>;
