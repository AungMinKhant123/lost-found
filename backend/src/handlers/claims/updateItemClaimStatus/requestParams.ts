import { Type, type Static } from "@sinclair/typebox";

export const UpdateItemClaimStatusRequestParamsSchema = Type.Object({
  itemId: Type.String({ format: "uuid" }),
  claimId: Type.String({ format: "uuid" }),
});

export type UpdateItemClaimStatusRequestParams = Static<
  typeof UpdateItemClaimStatusRequestParamsSchema
>;
