import { ProfileResponseBodySchema } from "./responseBody.js";

export const ProfileSchema = {
  tags: ["Auth"],
  summary: "User Profile ",
  description: "API to extract all the user data from the database.",

  security: [
    {
      bearerAuth: [],
    },
  ],

  response: { 200: ProfileResponseBodySchema },
};
