import { DeleteCategoryRequestParamsSchema } from "./requestParams.js";

import { DeleteCategoryResponseBodySchema } from "./responseBody.js";

export const DeleteCategorySchema = {
  tags: ["Category"],
  summary: "Delete category",
  description: "Allows an authenticated admin to delete an existing category.",

  security: [
    {
      bearerAuth: [],
    },
  ],

  params: DeleteCategoryRequestParamsSchema,

  response: { 200: DeleteCategoryResponseBodySchema },
};
