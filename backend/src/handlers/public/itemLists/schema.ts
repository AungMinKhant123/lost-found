import { ItemListsRequestQuerySchema } from "./requestQuery.js";
import { ItemListsResponseBodySchema } from "./responseBody.js";

export const ItemListsSchema = {
  tags: ["Public"],

  summary: "List lost and found items",

  description: "Search, filter, and paginate lost and found items.",

  querystring: ItemListsRequestQuerySchema,

  response: {
    200: ItemListsResponseBodySchema,
  },
};
