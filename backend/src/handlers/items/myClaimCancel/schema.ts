import { MyClaimCancelRequestParamsSchema } from "./requestParams.js";

import { MyClaimCancelResponseBodySchema } from "./responseBody.js";

export const MyClaimCancelSchema = {
  tags: ["Items"],
  summary: "Cancel My Claim",
  description: "Allows the authenticated user to cancel their own pending claim.",

  security: [
    {
      bearerAuth: []
    }
  ],

  params: MyClaimCancelRequestParamsSchema,

  response: { 200: MyClaimCancelResponseBodySchema },
};
