import { CreateItemResponseBodySchema } from "./responseBody.js";

export const CreateItemSchema = {
  tags: ["Items"],

  summary: "Create a new item",

  description: "Create a lost or found item with optional multiple images.",

  consumes: ["multipart/form-data"],

  security: [
    {
      bearerAuth: [],
    },
  ],

  response: {
    201: CreateItemResponseBodySchema,
  },
};
