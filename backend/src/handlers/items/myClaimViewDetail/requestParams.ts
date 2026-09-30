import { Type, type Static } from "@sinclair/typebox";

export const MyClaimDetailsRequestParamsSchema = Type.Object({
    claimId: Type.String({ format: "uuid" }),
});

export type MyClaimDetailsRequestParams = Static<
  typeof MyClaimDetailsRequestParamsSchema
>;
