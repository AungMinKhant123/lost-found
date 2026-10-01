import { Type, type Static } from "@sinclair/typebox";

export const GetAcceptedClaimContactRequestParamsSchema = Type.Object({
  itemId: Type.String({ format: "uuid" }),
  claimId: Type.String({ format: "uuid" }),
});

export type GetAcceptedClaimContactRequestParams = Static<
  typeof GetAcceptedClaimContactRequestParamsSchema
>;
