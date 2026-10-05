import { DeleteItemRequestParamsSchema } from "./requestParams.js";

import { DeleteItemResponseBodySchema } from "./responseBody.js";

export const DeleteItemSchema = {
  tags: ["Admin"],
  summary: "Delete Item",
  description: "API to delete the item.",

  security: [
    {
      bearerAuth: [],
    }
  ],

  params: DeleteItemRequestParamsSchema,

  response: { 200: DeleteItemResponseBodySchema },
};
