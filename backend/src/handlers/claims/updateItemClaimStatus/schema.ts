import { Type } from "@sinclair/typebox";
import { UpdateItemClaimStatusRequestBodySchema } from "./requestBody.js";
import { UpdateItemClaimStatusRequestParamsSchema } from "./requestParams.js";
import { UpdateItemClaimStatusResponseBodySchema } from "./responseBody.js";

const ErrorResponseSchema = Type.Object({
  message: Type.String(),
});

export const UpdateItemClaimStatusSchema = {
  tags: ["Items"],
  summary: "Update Item Claim Status",
  description: "Accept or decline a claim for an item owned by the user.",
  params: UpdateItemClaimStatusRequestParamsSchema,
  body: UpdateItemClaimStatusRequestBodySchema,
  response: {
    200: UpdateItemClaimStatusResponseBodySchema,
    403: ErrorResponseSchema,
    404: ErrorResponseSchema,
    409: ErrorResponseSchema,
  },
};
