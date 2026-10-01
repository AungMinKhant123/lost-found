import { Type } from "@sinclair/typebox";

import { GetItemClaimsRequestParamsSchema } from "./requestParams.js";
import { GetItemClaimsResponseBodySchema } from "./responseBody.js";

const ErrorResponseSchema = Type.Object({
  message: Type.String(),
});

export const GetItemClaimsSchema = {
  tags: ["Items"],
  summary: "Get Claims for Item",
  description: "Get an item and its claims for the item owner.",

  params: GetItemClaimsRequestParamsSchema,

  response: {
    200: GetItemClaimsResponseBodySchema,
    403: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
};
