import { ManageColorRequestBodySchema } from "./requestBody.js";
import { ManageColorResponseBodySchema } from "./responseBody.js";

export const CreateColorSchema = {
  tags: ["Color"],
  summary: "Create color",
  description: "Allows an admin to create a color attribute.",
  security: [{ bearerAuth: [] }],
  body: ManageColorRequestBodySchema,
  response: { 201: ManageColorResponseBodySchema },
};
