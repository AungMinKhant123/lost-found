import { RefreshResponseBodySchema } from "./responseBody.js";

export const RefreshSchema = {
  tags: ["Auth"],
  summary: "Refresh access token",
  description: "Rotate the refresh token and issue a new access token",

  response: { 200: RefreshResponseBodySchema },
};
