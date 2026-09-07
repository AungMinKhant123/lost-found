import { LoginRequestBodySchema } from "./requestBody.js";
import { LoginResponseBodySchema } from "./responseBody.js";

export const LoginSchema = {
  tags: ["Auth"],
  summary: "User login",
  description: "Authenticate a user with their email and password.",
  body: LoginRequestBodySchema,
  response: {
    200: LoginResponseBodySchema,
  },
};
