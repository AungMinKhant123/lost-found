import { FastifyInstance } from "fastify";
import { MyPostsSchema } from "../handlers/items/myPosts/schema.js";
import { myPostsHandler } from "../handlers/items/myPosts/handler.js";
import { MyClaimsSchema } from "../handlers/items/myClaims/schema.js";
import { myClaimsHandler } from "../handlers/items/myClaims/handler.js";
import { CreateItemSchema } from "../handlers/item/createItem/schema.js";
import { createItemHandler } from "../handlers/item/createItem/handler.js";

export async function itemsRoutes(app: FastifyInstance) {
  app.get(
    "/item/myposts",
    {
      preHandler: app.verifyUser,
      schema: MyPostsSchema,
    },
    myPostsHandler,
  );

  app.get(
    "/item/myclaims",
    {
      preHandler: app.verifyUser,
      schema: MyClaimsSchema,
    },
    myClaimsHandler,
  );
  app.post(
    "/item/createNewPost",
    {
      preHandler: app.verifyUser,
      schema: CreateItemSchema,
    },
    createItemHandler,
  );
}
