import { Type, type Static } from "@sinclair/typebox";

export const GetItemClaimsRequestParamsSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
});

export type GetItemClaimsRequestParams = Static<
  typeof GetItemClaimsRequestParamsSchema
>;
