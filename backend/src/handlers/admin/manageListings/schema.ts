import { ManageListingsRequestQuerySchema } from "./requestQuery.js";

import { ManageListingsResponseBodySchema } from "./responseBody.js";

export const ManageListingsSchema = {
  tags: ["Admin"],
  summary: "Manage Listings",
  description: 
    "API to search, filter, and paginate all item listings.",

  security: [
    {
      bearerAuth: [],
    }
  ],

  querystring: ManageListingsRequestQuerySchema,

  response: { 200: ManageListingsResponseBodySchema },
};
