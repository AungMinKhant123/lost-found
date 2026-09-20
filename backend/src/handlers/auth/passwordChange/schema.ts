import { PasswordChangeRequestBodySchema } from "./requestBody.js";

import { PasswordChangeResponseBodySchema } from "./responseBody.js";

export const PasswordChangeSchema = {
  tags: ["Auth"],
  summary: "Changing password.",
  description: "API to check user added current password and help to change the password.",

  body: PasswordChangeRequestBodySchema,

  security: [
    {
      bearerAuth: []
    }
  ],

  response: { 200: PasswordChangeResponseBodySchema },
};
