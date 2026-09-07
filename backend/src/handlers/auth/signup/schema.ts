import { SignupRequestBodySchema } from "./requestBody.js";
import { SignupResponseBodySchema } from "./responseBody.js";

export const SignupSchema = {
  tags: ["Auth"],

  summary: "Create a new user account",

  description:
    "Creates a new user account using a username, email, and password.",

  body: SignupRequestBodySchema,

  response: {
    201: SignupResponseBodySchema,
  },
};
