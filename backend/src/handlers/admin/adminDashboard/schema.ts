import { AdminDashboardRequestQuerySchema } from "./requestQuery.js";

import { AdminDashboardResponseBodySchema } from "./responseBody.js";

export const AdminDashboardSchema = {
  tags: ["Admin"],
  summary: "Admin Dashboard",
  description:
    "API to fetch admin dashboard statistics, " +
    "caterogy statics, and recent platform activity.",

  security: [
    {
      bearerAuth: [],
    },
  ],

  querystring: AdminDashboardRequestQuerySchema,

  response: { 200: AdminDashboardResponseBodySchema },
};
