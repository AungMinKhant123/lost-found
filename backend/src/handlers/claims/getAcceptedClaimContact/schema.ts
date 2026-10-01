import { Type } from "@sinclair/typebox";
import { GetAcceptedClaimContactRequestParamsSchema } from "./requestParams.js";
import { GetAcceptedClaimContactResponseBodySchema } from "./responseBody.js";

const ErrorResponseSchema = Type.Object({
  message: Type.String(),
});

export const GetAcceptedClaimContactSchema = {
  tags: ["Items"],
  summary: "Get Accepted Claim Contact",
  description:
    "Get claimant contact details for an accepted claim's item owner.",
  params: GetAcceptedClaimContactRequestParamsSchema,
  response: {
    200: GetAcceptedClaimContactResponseBodySchema,
    403: ErrorResponseSchema,
    404: ErrorResponseSchema,
    409: ErrorResponseSchema,
  },
};
