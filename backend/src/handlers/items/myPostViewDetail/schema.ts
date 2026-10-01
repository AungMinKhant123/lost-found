import { MyPostViewDetailRequestParamsSchema } from "./requestParams.js";
import { MyPostViewDetailResponseBodySchema } from "./responseBody.js";

export const MyPostViewDetailSchema = {
  tags: ["Items"],

  summary: "View Details for User Post",

  description: "API to fetch item details and show users who submitted claims.",

  security: [
    {
      bearerAuth: [],
    },
  ],

  params: MyPostViewDetailRequestParamsSchema,

  response: {
    200: MyPostViewDetailResponseBodySchema,
  },
};
