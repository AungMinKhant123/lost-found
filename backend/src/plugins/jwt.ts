import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";

import { config } from "../config.js";
import { SYS_CONSTANTS } from "../constants/system.js";

async function jwtPlugin(app: FastifyInstance) {
  await app.register(fastifyJwt, {
    secret: config.jwtSecret,

    cookie: {
      cookieName: SYS_CONSTANTS.ACCESS_TOKEN_COOKIE,
      signed: false,
    },
  });
}

export default fp(jwtPlugin);
