import { MyClaimDetailsRequestParamsSchema } from "./requestParams.js";

import { MyClaimDetailsResponseBodySchema } from "./responseBody.js";

export const MyClaimDetailsSchema = {
  tags: ["Items"],
  summary: "My Claim Details",
  description: "API to fetch details of one claim submitted by the authenticated user.",

  security: [
    {
      bearerAuth: [],
    }
  ],

  params: MyClaimDetailsRequestParamsSchema,

  response: { 200: MyClaimDetailsResponseBodySchema },
};
