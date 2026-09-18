import { LatestItemsResponseBodySchema } from "./responseBody.js";

export const LatestItemsSchema = {
  tags: ["Public"],
  summary: "Get latest items",
  description:
    "Retrieve the 6 latest lost and found items for the public page.",

  response: { 200: LatestItemsResponseBodySchema },
};
