import { ProfileEditResponseBodySchema } from "./responseBody.js";

export const ProfileEditSchema = {
  tags: ["Auth"],

  summary: "Profile Edit",

  description:
    "Update the authenticated user's profile information and optional profile image.",

  consumes: ["multipart/form-data"],

  security: [
    {
      bearerAuth: [],
    },
  ],

  response: {
    200: ProfileEditResponseBodySchema,
  },
};
