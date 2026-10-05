import { Type } from "@sinclair/typebox";
import { UpdateMyPostRequestBodySchema } from "./requestBody.js";
import { UpdateMyPostRequestParamsSchema } from "./requestParams.js";
import { UpdateMyPostResponseBodySchema } from "./responseBody.js";

const ErrorResponseSchema = Type.Object({
  message: Type.String(),
});

export const UpdateMyPostSchema = {
  tags: ["Items"],
  summary: "Update My Post",
  description: "Allows the authenticated owner to update an open post.",
  security: [{ bearerAuth: [] }],
  params: UpdateMyPostRequestParamsSchema,
  body: UpdateMyPostRequestBodySchema,
  response: {
    200: UpdateMyPostResponseBodySchema,
    403: ErrorResponseSchema,
    404: ErrorResponseSchema,
    409: ErrorResponseSchema,
  },
};
