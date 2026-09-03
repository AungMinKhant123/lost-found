import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

async function authPlugin(app: FastifyInstance) {
  app.decorate("verifyUser", async function (request) {
    await request.jwtVerify();
  });
}

export default fp(authPlugin);
