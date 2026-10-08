import { Type, type Static } from "@sinclair/typebox";
import { UserRole } from "../../../generated/enums.js";

export const ProfileResponseBodySchema = Type.Object({
  id: Type.String(),

  firstName: Type.String(),
  lastName: Type.String(),
  email: Type.String(),

  role: Type.Enum(UserRole),
  phone: Type.Union([Type.String(), Type.Null()]),

  profileKey: Type.Union([Type.String(), Type.Null()]),

  profileUrl: Type.Union([Type.String(), Type.Null()]),

  socialMedia: Type.Union([Type.String(), Type.Null()]),

  profession: Type.Union([
    Type.Literal("STUDENT"),
    Type.Literal("TEACHER"),
    Type.Literal("WORKER"),
    Type.Null(),
  ]),

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
