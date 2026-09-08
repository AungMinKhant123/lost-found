import { LoginRequestBodySchema } from "./requestBody.js";

import { LoginResponseBodySchema } from "./responseBody.js";

export const LoginSchema = {
  tags: ["Auth"],
  summary: "Login",
  description: "This API is for Login.",

  body: LoginRequestBodySchema,

  response: { 200: LoginResponseBodySchema },
};
