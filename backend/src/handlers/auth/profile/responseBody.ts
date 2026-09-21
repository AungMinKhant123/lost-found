import { Type, type Static } from "@sinclair/typebox";

export const ProfileResponseBodySchema = Type.Object({
  id: Type.String(),

  firstName: Type.String(),
  lastName: Type.String(),
  email: Type.String(),

  phone: Type.Union([Type.String(), Type.Null()]),

  profileUrl: Type.Union([Type.String(), Type.Null()]),
  socialMedia: Type.Union([Type.String(), Type.Null()]),

  profession: Type.Union([Type.String(), Type.Null()]),

  aboutMe: Type.Union([Type.String(), Type.Null()]),

  passwordUpdatedAt: Type.Union([Type.String(), Type.Null()]),

  stats: Type.Object({
    itemReports: Type.Number(),
    itemsFound: Type.Number(),
    claimsSubmitted: Type.Number(),
    itemsReturned: Type.Number(),
  }),
});

export type ProfileResponseBody = Static<typeof ProfileResponseBodySchema>;
