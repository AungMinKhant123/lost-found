import { Type, type Static } from "@sinclair/typebox";
import { ClaimStatus } from "../../../generated/enums.js";

export const CreateClaimResponseBodySchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  status: Type.Enum(ClaimStatus),
  createdAt: Type.String(),
});

export type CreateClaimResponseBody = Static<
  typeof CreateClaimResponseBodySchema
>;
