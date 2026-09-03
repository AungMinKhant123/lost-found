import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";
import { config } from "../config.js";

async function jwtPlugin(app: FastifyInstance) {
  await app.register(fastifyJwt, {
    secret: config.jwtSecret,
  });
}

export default fp(jwtPlugin);
