import { ManageColorRequestParamsSchema } from "./requestParams.js";
import { DeleteColorResponseBodySchema } from "./responseBody.js";

export const DeleteColorSchema = {
  tags: ["Color"],
  summary: "Delete color",
  description: "Allows an admin to delete an unused color attribute.",
  security: [{ bearerAuth: [] }],
  params: ManageColorRequestParamsSchema,
  response: { 200: DeleteColorResponseBodySchema },
};
