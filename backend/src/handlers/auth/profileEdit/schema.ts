import { ProfileEditRequestBodySchema } from "./requestBody.js";

import { ProfileEditResponseBodySchema } from "./responseBody.js";

export const ProfileEditSchema = {
  tags: ["Auth"],
  summary: "Profile Edit",
  description: "API to update the authenticated user's profile.",

  security: [
    {
      bearerAuth: [],
    }
  ],

  body: ProfileEditRequestBodySchema,

  response: { 200: ProfileEditResponseBodySchema },
};
