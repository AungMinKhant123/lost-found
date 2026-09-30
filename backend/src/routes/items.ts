import { FastifyInstance } from "fastify";
import { MyPostsSchema } from "../handlers/items/myPosts/schema.js";
import { myPostsHandler } from "../handlers/items/myPosts/handler.js";
import { MyClaimsSchema } from "../handlers/items/myClaims/schema.js";
import { myClaimsHandler } from "../handlers/items/myClaims/handler.js";
import { CreateItemSchema } from "../handlers/item/createItem/schema.js";
import { createItemHandler } from "../handlers/item/createItem/handler.js";
import { MyClaimCancelSchema } from "../handlers/items/myClaimCancel/schema.js";
import { myClaimCancelHandler } from "../handlers/items/myClaimCancel/handler.js";
import { MyPostDeleteSchema } from "../handlers/items/myPostDelete/schema.js";
import { myPostDeleteHandler } from "../handlers/items/myPostDelete/handler.js";
import { MyClaimDetailsSchema } from "../handlers/items/myClaimViewDetail/schema.js";
import { myClaimDetailsHandler } from "../handlers/items/myClaimViewDetail/handler.js";
import { MyPostViewDetailSchema } from "../handlers/items/myPostViewDetail/schema.js";
import { myPostViewDetailHandler } from "../handlers/items/myPostViewDetail/handler.js";

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

  app.delete(
    "/item/cancelclaims/:claimId",
    {
      preHandler: app.verifyUser,
      schema: MyClaimCancelSchema,
    },
    myClaimCancelHandler,
  );

  app.delete(
    "/item/deleteposts/:itemId",
    {
      preHandler: app.verifyUser,
      schema: MyPostDeleteSchema,
    },
    myPostDeleteHandler,
  );

  app.get(
    "/item/myclaims/:claimId",
    {
      preHandler: app.verifyUser,
      schema: MyClaimDetailsSchema,
    },
    myClaimDetailsHandler,
  );

  app.get(
    "/item/mypostviewdetail/:itemId",
    {
      preHandler: app.verifyUser,
      schema: MyPostViewDetailSchema,
    },
    myPostViewDetailHandler,
  )
};
