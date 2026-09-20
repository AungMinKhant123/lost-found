import { ProfileEditRequestBodySchema } from "./requestBody.js";

import { ProfileEditResponseBodySchema } from "./responseBody.js";

export const ProfileEditSchema = {
  tags: ["Auth"],
  summary: "Profile Edit",
  description: "API to fetch the user profile data and accept user edit inputs.",

  security: [
    {
      bearerAuth: [],
    }
  ],

  body: ProfileEditRequestBodySchema,

  response: { 200: ProfileEditResponseBodySchema },
};
