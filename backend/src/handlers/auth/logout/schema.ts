import { LogoutResponseBodySchema } from "./responseBody.js";

export const LogoutSchema = {
  tags: ["Auth"],
  summary: "logout",
  description: "This API is for Logout",

  response: { 200: LogoutResponseBodySchema },
};
