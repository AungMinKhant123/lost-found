import { ItemListsRequestQuerySchema } from "./requestQuery.js";

import { ItemListsResponseBodySchema } from "./responseBody.js";

export const ItemListsSchema = {
  tags: ["Public"],
  summary: "Public item Lists",
  description: "Search,  filter and paginate lost and found items.",

  querystring: ItemListsRequestQuerySchema,

  response: { 200: ItemListsResponseBodySchema },
};
