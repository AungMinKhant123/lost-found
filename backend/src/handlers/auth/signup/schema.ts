import { SignupRequestBodySchema } from "./requestBody.js";

import { SignupResponseBodySchema } from "./responseBody.js";

export const SignupSchema = {
  tags: ["Auth"],
  summary: "Sign Up",
  description: "This API is for SignUp.",

  body: SignupRequestBodySchema,

  response: { 200: SignupResponseBodySchema },
};
