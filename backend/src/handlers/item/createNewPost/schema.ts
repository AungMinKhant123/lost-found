import { CreateItemResponseBodySchema } from "./responseBody.js";

export const CreateItemSchema = {
  tags: ["Items"],

  summary: "Create a new lost or found item",

  description: "Create a lost or found item with optional multiple images.",

  security: [
    {
      bearerAuth: [],
    },
  ],

  consumes: ["multipart/form-data"],

  response: {
    201: CreateItemResponseBodySchema,
  },
};
