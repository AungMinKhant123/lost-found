import { AddCategoryRequestBodySchema } from "./requestBody.js";

import { AddCategoryResponseBodySchema } from "./responseBody.js";

export const AddCategorySchema = {
  tags: ["Category"],
  summary: "Add Category",
  description: "Allows an authenticated admin to create a new category.",

  security: [
    {
      bearerAuth: [],
    },
  ],

  body: AddCategoryRequestBodySchema,

  response: { 201: AddCategoryResponseBodySchema },
};
