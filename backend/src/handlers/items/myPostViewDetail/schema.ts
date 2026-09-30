import { MyPostViewDetailRequestParamsSchema } from "./requestParams.js";

import { MyPostViewDetailResponseBodySchema } from "./responseBody.js";

export const MyPostViewDetailSchema = {
  tags: ["Items"],
  summary: "View Details for user Posts",
  description: "API to feth the item details and show claim users.",

  security: [
    {
      bearerAuth: []
    }
  ],

  params: MyPostViewDetailRequestParamsSchema,

  response: { 200: MyPostViewDetailResponseBodySchema },
};
