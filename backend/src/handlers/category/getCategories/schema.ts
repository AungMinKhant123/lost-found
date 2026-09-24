import { GetCategoriesResponseBodySchema } from "./responseBody.js";

export const GetCategoriesSchema = {
  tags: ["Category"],

  summary: "Get categories",

  description: "Get all categories for item selection.",

  response: { 200: GetCategoriesResponseBodySchema },
};
