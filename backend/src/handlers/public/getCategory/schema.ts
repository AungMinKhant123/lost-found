import { GetCategoryResponseBodySchema } from "./responseBody.js";

export const GetCategorySchema = {
  tags: ["Public"],
  summary: "Getting Category",
  description: "API for fetching available Category.",

  response: { 200: GetCategoryResponseBodySchema },
};
