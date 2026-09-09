import "fastify";
import "@fastify/jwt";
import type { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    verifyUser: (request: FastifyRequest) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      userId: string;
      email: string;
    };

    user: {
      userId: string;
      email: string;
    };
  }
}

declare module "fastify" {
  interface FastifyRequest {
    user: {
      userId: string;
      email: string;
    };
  }
}
