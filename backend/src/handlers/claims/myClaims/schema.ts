import { MyClaimsRequestQuerySchema } from "./requestQuery.js";

import { MyClaimsResponseBodySchema } from "./responseBody.js";

export const MyClaimsSchema = {
  tags: ["Items"],
  summary: "My Claims",
  description:
    "API to show the authenticated user's claims and their statuses on other users' posts.",

  security: [
    {
      bearerAuth: [],
    },
  ],

  querystring: MyClaimsRequestQuerySchema,

  response: { 200: MyClaimsResponseBodySchema },
};
