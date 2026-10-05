import { ViewItemRequestParamsSchema } from "./requestParams.js";

import { ViewItemResponseBodySchema } from "./responseBody.js";

export const ViewItemSchema = {
  tags: ["Admin"],
  summary: "View Item",
  description: "API to fetch an item and its received claim history.",

  security: [
    {
      bearerAuth: [],
    }
  ],

  params: ViewItemRequestParamsSchema,

  response: { 200: ViewItemResponseBodySchema },
};
