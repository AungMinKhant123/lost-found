import { FastifyInstance } from "fastify";
import { loginUser, registerUser } from "../handlers/auth.handler.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

export default async function authRoutes(app: FastifyInstance) {
  app.post(
    "/auth/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Register a new user",
        ...registerSchema,
      },
    },
    registerUser,
  );

  app.post(
    "/auth/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Login user",
        ...loginSchema,
      },
    },
    loginUser,
  );
}
