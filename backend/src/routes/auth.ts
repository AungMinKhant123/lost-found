import type { FastifyInstance } from "fastify";
import { signupHandler } from "../handlers/auth/signup/handler.js";
import { SignupSchema } from "../handlers/auth/signup/schema.js";
import { LoginSchema } from "../handlers/auth/login/schema.js";
import { loginHandler } from "../handlers/auth/login/handler.js";
import { LogoutSchema } from "../handlers/auth/logout/schema.js";
import { logoutHandler } from "../handlers/auth/logout/handler.js";
import { RefreshSchema } from "../handlers/auth/refresh/schema.js";
import { refreshHandler } from "../handlers/auth/refresh/handler.js";
export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/signup", { schema: SignupSchema }, signupHandler);
  app.post("/auth/login", { schema: LoginSchema }, loginHandler);
  app.post(
    "/auth/logout",
    {
      schema: LogoutSchema,
      preHandler: app.verifyUser,
    },
    logoutHandler,
  );
  app.post("/auth/refresh", { schema: RefreshSchema }, refreshHandler);
}
