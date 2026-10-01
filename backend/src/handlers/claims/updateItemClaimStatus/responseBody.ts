import { Type, type Static } from "@sinclair/typebox";
import { ClaimStatus } from "../../../generated/enums.js";

export const UpdateItemClaimStatusResponseBodySchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  status: Type.Enum(ClaimStatus),
});

export type UpdateItemClaimStatusResponseBody = Static<
  typeof UpdateItemClaimStatusResponseBodySchema
>;
