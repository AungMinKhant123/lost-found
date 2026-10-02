import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { AppError } from "../errors/AppError.js";
import { UserRole } from "../generated/enums.js";

async function authPlugin(app: FastifyInstance) {
  app.decorate("verifyUser", async function (request) {
    await request.jwtVerify();
  });

  app.decorate("verifyAdmin", async function (request) {
    await request.jwtVerify();

    if (
      request.user.role !== UserRole.ADMIN &&
      request.user.role !== UserRole.SUPERADMIN
    ) {
      throw new AppError("Admin access required.", 403);
    }
  });

  app.decorate("verifySuperAdmin", async function (request) {
    await request.jwtVerify();

    if (request.user.role !== UserRole.SUPERADMIN) {
      throw new AppError("Super admin access required.", 403);
    }
  });
}

export default fp(authPlugin);
