import type { FastifyInstance } from "fastify";
import { signupHandler } from "../handlers/auth/signup/handler.js";
import { SignupSchema } from "../handlers/auth/signup/schema.js";
import { LoginSchema } from "../handlers/auth/login/schema.js";
import { loginHandler } from "../handlers/auth/login/handler.js";
export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/signup", { schema: SignupSchema }, signupHandler);
  app.post("/auth/login", { schema: LoginSchema }, loginHandler);
}
