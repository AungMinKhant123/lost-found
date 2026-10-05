import { EditCategoryRequestParamsSchema } from "./requestParams.js";

import { EditCategoryRequestBodySchema } from "./requestBody.js";

import { EditCategoryResponseBodySchema } from "./responseBody.js";

export const EditCategorySchema = {
  tags: ["Category"],
  summary: "Edit Category",
  description: "Allows an authenticated admin to edit an existing category.",

  security: [
    {
      bearerAuth: [],
    },
  ],

  params: EditCategoryRequestParamsSchema,

  body: EditCategoryRequestBodySchema,

  response: { 200: EditCategoryResponseBodySchema },
};
