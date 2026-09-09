import fp from "fastify-plugin";
import { FastifyError, FastifyInstance } from "fastify";
import { AppError } from "../errors/AppError.js";
import { Prisma } from "../generated/client.js";

async function errorHandlerPlugin(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request, reply) => {
    app.log.error(error);

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        message: error.message,
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return reply.status(404).send({
          message: "Record not found",
        });
      }
      if (error.code === "P2002") {
        return reply.status(409).send({
          message: "A record with this value already exists",
        });
      }

      return reply.status(500).send({
        message: "Database error",
      });
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return reply.status(503).send({
        message: "Database unavailable",
      });
    }

    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        message: error.message,
      });
    }

    return reply.status(500).send({
      message: "Internal Server Error",
    });
  });
}

export default fp(errorHandlerPlugin);
