import { MyPostDeleteRequestParamsSchema } from "./requestParams.js";

import { MyPostDeleteResponseBodySchema } from "./responseBody.js";

export const MyPostDeleteSchema = {
  tags: ["Items"],
  summary: "Delete My Post",
  description: "Allows the authenticated user to delete their posted items.",

  security: [
    {
      bearerAuth: []
    }
  ],

  params: MyPostDeleteRequestParamsSchema,

  response: { 200: MyPostDeleteResponseBodySchema },
};
