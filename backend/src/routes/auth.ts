import type { FastifyInstance } from "fastify";

import { signupHandler } from "../handlers/auth/signup/handler.js";
import { SignupSchema } from "../handlers/auth/signup/schema.js";

import { loginHandler } from "../handlers/auth/login/handler.js";
import { LoginSchema } from "../handlers/auth/login/schema.js";

import { logoutHandler } from "../handlers/auth/logout/handler.js";
import { LogoutSchema } from "../handlers/auth/logout/schema.js";

import { refreshHandler } from "../handlers/auth/refresh/handler.js";
import { RefreshSchema } from "../handlers/auth/refresh/schema.js";

import { profileHandler } from "../handlers/auth/profile/handler.js";
import { ProfileSchema } from "../handlers/auth/profile/schema.js";
import { passwordChangeHandler } from "../handlers/auth/passwordChange/handler.js";
import { PasswordChangeSchema } from "../handlers/auth/passwordChange/schema.js";
import { ProfileEditSchema } from "../handlers/auth/profileEdit/schema.js";
import { profileEditHandler } from "../handlers/auth/profileEdit/handler.js";
import { UserDeleteSchema } from "../handlers/auth/userDelete/schema.js";
import { userDeleteHandler } from "../handlers/auth/userDelete/handler.js";

export async function authRoutes(app: FastifyInstance) {
  // Public
  app.post("/auth/signup", { schema: SignupSchema }, signupHandler);
  app.post("/auth/login", { schema: LoginSchema }, loginHandler);

  app.post("/auth/refresh", { schema: RefreshSchema }, refreshHandler);

  // Protected
  app.post(
    "/auth/logout",
    {
      schema: LogoutSchema,
    },
    logoutHandler,
  );

  app.get(
    "/auth/profile",
    {
      preHandler: app.verifyUser,
      schema: ProfileSchema,
    },
    profileHandler,
  );

  app.patch(
    "/auth/password",
    {
      preHandler: app.verifyUser,
      schema: PasswordChangeSchema,
    },
    passwordChangeHandler,
  );

  app.patch(
    "/auth/profile",
    {
      preHandler: app.verifyUser,
      schema: ProfileEditSchema,
    },
    profileEditHandler,
  );
  app.delete(
    "/auth/userDelete",
    {
      preHandler: app.verifyUser,
      schema: UserDeleteSchema,
    },
    userDeleteHandler,
  )
}
