import { GetColorResponseBodySchema } from "./responseBody.js";

export const GetColorSchema = {
  tags: ["Color"],
  summary: "Getting Color",
  description: "API for fetching available Color.",

  response: { 200: GetColorResponseBodySchema },
};
