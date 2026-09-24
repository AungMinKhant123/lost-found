import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export default fp(async (app: FastifyInstance) => {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Lost and Found API",
        description: "Lost and found backend API",
        version: "1.0.0",
      },

      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },

    transform: ({ schema, url, route }) => {
      if (url === "/auth/profile" && route.method === "PATCH") {
        return {
          schema: {
            ...schema,

            body: {
              type: "object",

              properties: {
                fullName: {
                  type: "string",
                  minLength: 1,
                  example: "john smith",
                },

                phone: {
                  type: "string",
                  example: "09123456789",
                },

                socialMedia: {
                  type: "string",
                  example: "facebook: john@facebook.com",
                },

                profession: {
                  type: "string",
                  enum: ["STUDENT", "TEACHER", "WORKER"],
                  example: "STUDENT",
                },

                aboutMe: {
                  type: "string",
                  example: "Yo! I'm friendly.",
                },

                profileImage: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },

          url,
        };
      }

      if (url === "/item/createNewPost" && route.method === "POST") {
        return {
          schema: {
            ...schema,

            body: {
              type: "object",

              required: [
                "type",
                "title",
                "categoryId",
                "location",
                "colorId",
                "dateLostOrFound",
              ],

              properties: {
                type: {
                  type: "string",
                  enum: ["LOST", "FOUND"],
                },

                title: {
                  type: "string",
                  minLength: 1,
                  maxLength: 200,
                },

                categoryId: {
                  type: "string",
                },

                location: {
                  type: "string",
                  minLength: 1,
                  maxLength: 255,
                },

                colorId: {
                  type: "string",
                },

                dateLostOrFound: {
                  type: "string",
                  format: "date-time",
                },

                description: {
                  type: "string",
                  maxLength: 2000,
                },

                images: {
                  type: "array",

                  items: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },

          url,
        };
      }

      return {
        schema,
        url,
      };
    },
  });

  await app.register(swaggerUI, {
    routePrefix: "/docs",
  });
});
