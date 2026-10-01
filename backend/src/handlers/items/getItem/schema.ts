import { Type } from "@sinclair/typebox";

import { GetItemRequestParamsSchema } from "./requestParams.js";
import { GetItemResponseBodySchema } from "./responseBody.js";

const ErrorResponseSchema = Type.Object({
  message: Type.String(),
});

export const GetItemSchema = {
  tags: ["Items"],

  summary: "Get Item",

  description: "API to fetch a single item by ID.",

  params: GetItemRequestParamsSchema,

  response: {
    200: GetItemResponseBodySchema,

    404: ErrorResponseSchema,
  },
};
