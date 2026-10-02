import "fastify";
import "@fastify/jwt";
import type { FastifyRequest } from "fastify";
import { UserRole } from "../generated/enums.ts";

declare module "fastify" {
  interface FastifyInstance {
    verifyUser: (request: FastifyRequest) => Promise<void>;
    verifyAdmin: (request: FastifyRequest) => Promise<void>;
    verifySuperAdmin: (request: FastifyRequest) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      userId: string;
      email: string;
      role: UserRole;
    };

    user: {
      userId: string;
      email: string;
      role: UserRole;
    };
  }
}

declare module "fastify" {
  interface FastifyRequest {
    user: {
      userId: string;
      email: string;
      role: UserRole;
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    minio: Client;
  }
}
