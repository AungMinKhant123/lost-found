import { RefreshRequestBodySchema } from "./requestBody.js";

import { RefreshResponseBodySchema } from "./responseBody.js";

export const RefreshSchema = {
  tags: ["Auth"],
  summary: "Refresh access token",
  description: "Rotate the refresh token and issue a new access token",

  body: RefreshRequestBodySchema,

  response: { 200: RefreshResponseBodySchema },
};
