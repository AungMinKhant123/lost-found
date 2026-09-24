import { MyPostsRequestQuerySchema } from "./requestQuery.js";

import { MyPostsResponseBodySchema } from "./responseBody.js";

export const MyPostsSchema = {
  tags: ["Items"],
  summary: "My Posts",
  description: "API to fetch user uploaded Items.",

  security: [
    {
      bearerAuth: [],
    },
  ],

  querystring: MyPostsRequestQuerySchema,

  response: { 200: MyPostsResponseBodySchema },
};
