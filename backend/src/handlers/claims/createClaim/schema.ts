import { Type } from "@sinclair/typebox";
import { CreateClaimRequestBodySchema } from "./requestBody.js";
import { CreateClaimResponseBodySchema } from "./responseBody.js";

const ErrorResponseSchema = Type.Object({
  message: Type.String(),
});

export const CreateClaimSchema = {
  tags: ["Claims"],
  summary: "Create Claim",
  description: "Submit an ownership claim for an item.",
  security: [{ bearerAuth: [] }],
  body: CreateClaimRequestBodySchema,
  response: {
    201: CreateClaimResponseBodySchema,
    400: ErrorResponseSchema,
    403: ErrorResponseSchema,
    404: ErrorResponseSchema,
    409: ErrorResponseSchema,
  },
};
