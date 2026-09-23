import { CreateNewPostRequestBodySchema } from "./requestBody.js";

import { CreateNewPostResponseBodySchema } from "./responseBody.js";

export const CreateNewPostSchema = {
  tags: ["Public"],
  summary: "Creating new post.",
  description: "API to save user created new post data.",
  
  body: CreateNewPostRequestBodySchema,

  response: { 200: CreateNewPostResponseBodySchema },
};
