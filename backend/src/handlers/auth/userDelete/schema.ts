import { UserDeleteResponseBodySchema } from "./responseBody.js";

export const UserDeleteSchema = {
  tags: ["Auth"],
  summary: "User Account Deletion",
  description: "API to Delete User Acound",

  security: [
    {
      bearerAuth: [],
    },
  ],

  response: { 200: UserDeleteResponseBodySchema },
};
