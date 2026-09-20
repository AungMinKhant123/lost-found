import { Type, type Static } from "@sinclair/typebox";
import { UserProfession } from "../../../generated/enums.js";

export const ProfileEditRequestBodySchema = Type.Object({
  
  profileUrl: Type.Optional(Type.String()),
  fullName: Type.String({ minLength: 1 }),
  email: Type.String({ format:"email" }),
  phone: Type.Optional(Type.String()),
  //need to add social media
  profession: Type.Optional(Type.Enum(UserProfession)),
  aboutMe: Type.Optional(Type.String()),
});

export type ProfileEditRequestBody = Static<
  typeof ProfileEditRequestBodySchema
>;
