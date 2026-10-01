import { Type, type Static } from "@sinclair/typebox";
import { ClaimStatus } from "../../../generated/enums.js";

const ItemClaimStatusQuerySchema = Type.Unsafe<ClaimStatus>({
  type: "string",
  enum: ["PENDING", "ACCEPTED", "DECLINED"],
});

export const MyClaimsRequestQuerySchema = Type.Object({
  claimStatus: Type.Optional(ItemClaimStatusQuerySchema),
  page: Type.Optional(Type.String()),
  limit: Type.Optional(Type.String()),
});

export type MyClaimsRequestQuery = Static<typeof MyClaimsRequestQuerySchema>;
