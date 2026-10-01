import { FastifyInstance } from "fastify";
import { MyPostsSchema } from "../handlers/items/myPosts/schema.js";
import { myPostsHandler } from "../handlers/items/myPosts/handler.js";
import { MyClaimsSchema } from "../handlers/claims/myClaims/schema.js";
import { myClaimsHandler } from "../handlers/claims/myClaims/handler.js";
import { CreateItemSchema } from "../handlers/items/createItem/schema.js";
import { createItemHandler } from "../handlers/items/createItem/handler.js";
import { GetItemSchema } from "../handlers/items/getItem/schema.js";
import { getItemHandler } from "../handlers/items/getItem/handler.js";
import { CreateClaimSchema } from "../handlers/claims/createClaim/schema.js";
import { createClaimHandler } from "../handlers/claims/createClaim/handler.js";
import { GetItemClaimsSchema } from "../handlers/claims/getItemClaims/schema.js";
import type { GetItemClaimsRequestParams } from "../handlers/claims/getItemClaims/requestParams.js";
import { getItemClaimsHandler } from "../handlers/claims/getItemClaims/handler.js";
import { UpdateItemClaimStatusSchema } from "../handlers/claims/updateItemClaimStatus/schema.js";
import type { UpdateItemClaimStatusRequestBody } from "../handlers/claims/updateItemClaimStatus/requestBody.js";
import type { UpdateItemClaimStatusRequestParams } from "../handlers/claims/updateItemClaimStatus/requestParams.js";
import { updateItemClaimStatusHandler } from "../handlers/claims/updateItemClaimStatus/handler.js";

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
  app.get(
    "/items/:id",
    {
      schema: GetItemSchema,
    },
    getItemHandler,
  );
  app.post(
    "/claims",
    {
      preHandler: app.verifyUser,
      schema: CreateClaimSchema,
    },
    createClaimHandler,
  );
  app.get<{ Params: GetItemClaimsRequestParams }>(
    "/items/:id/claims",
    {
      preHandler: app.verifyUser,
      schema: GetItemClaimsSchema,
    },
    getItemClaimsHandler,
  );
  app.patch<{
    Params: UpdateItemClaimStatusRequestParams;
    Body: UpdateItemClaimStatusRequestBody;
  }>(
    "/items/:itemId/claims/:claimId",
    {
      preHandler: app.verifyUser,
      schema: UpdateItemClaimStatusSchema,
    },
    updateItemClaimStatusHandler,
  );
}
