import { Type, type Static } from "@sinclair/typebox";

const AcceptedClaimContactSchema = Type.Object({
  firstName: Type.String(),
  lastName: Type.String(),
  email: Type.String(),
  phone: Type.Union([Type.String(), Type.Null()]),
  profileUrl: Type.Union([Type.String(), Type.Null()]),
});

export const GetAcceptedClaimContactResponseBodySchema = Type.Object({
  data: AcceptedClaimContactSchema,
});

export type GetAcceptedClaimContactResponseBody = Static<
  typeof GetAcceptedClaimContactResponseBodySchema
>;
