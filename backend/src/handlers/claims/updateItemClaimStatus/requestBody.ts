import { Type, type Static } from "@sinclair/typebox";

export const UpdateItemClaimStatusRequestBodySchema = Type.Object({
  status: Type.Union([Type.Literal("ACCEPTED"), Type.Literal("DECLINED")]),
});

export type UpdateItemClaimStatusRequestBody = Static<
  typeof UpdateItemClaimStatusRequestBodySchema
>;
