import { Type, type Static } from "@sinclair/typebox";

export const ProfileEditResponseBodySchema = Type.Object({
  message: Type.String(),

  profileKey: Type.Optional(Type.String()),
});

export type ProfileEditResponseBody = Static<
  typeof ProfileEditResponseBodySchema
>;
