import { ManageColorRequestBodySchema } from "./requestBody.js";
import { ManageColorRequestParamsSchema } from "./requestParams.js";
import { ManageColorResponseBodySchema } from "./responseBody.js";

export const UpdateColorSchema = {
  tags: ["Color"],
  summary: "Update color",
  description: "Allows an admin to update a color attribute.",
  security: [{ bearerAuth: [] }],
  params: ManageColorRequestParamsSchema,
  body: ManageColorRequestBodySchema,
  response: { 200: ManageColorResponseBodySchema },
};
