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
import { GetAcceptedClaimContactSchema } from "../handlers/claims/getAcceptedClaimContact/schema.js";
import type { GetAcceptedClaimContactRequestParams } from "../handlers/claims/getAcceptedClaimContact/requestParams.js";
import { getAcceptedClaimContactHandler } from "../handlers/claims/getAcceptedClaimContact/handler.js";
import { UpdateItemClaimStatusSchema } from "../handlers/claims/updateItemClaimStatus/schema.js";
import type { UpdateItemClaimStatusRequestBody } from "../handlers/claims/updateItemClaimStatus/requestBody.js";
import type { UpdateItemClaimStatusRequestParams } from "../handlers/claims/updateItemClaimStatus/requestParams.js";
import { updateItemClaimStatusHandler } from "../handlers/claims/updateItemClaimStatus/handler.js";
import { myClaimCancelHandler } from "../handlers/items/myClaimCancel/handler.js";
import { MyClaimCancelSchema } from "../handlers/items/myClaimCancel/schema.js";
import { MyPostDeleteSchema } from "../handlers/items/myPostDelete/schema.js";
import { myPostDeleteHandler } from "../handlers/items/myPostDelete/handler.js";
import { UpdateMyPostSchema } from "../handlers/items/updateMyPost/schema.js";
import type { UpdateMyPostRequestBody } from "../handlers/items/updateMyPost/requestBody.js";
import type { UpdateMyPostRequestParams } from "../handlers/items/updateMyPost/requestParams.js";
import { updateMyPostHandler } from "../handlers/items/updateMyPost/handler.js";
import { MyClaimDetailsSchema } from "../handlers/items/myClaimViewDetail/schema.js";
import { myClaimDetailsHandler } from "../handlers/items/myClaimViewDetail/handler.js";
import { MyPostViewDetailSchema } from "../handlers/items/myPostViewDetail/schema.js";
import { myPostViewDetailHandler } from "../handlers/items/myPostViewDetail/handler.js";
import type { MyPostViewDetailRequestParams } from "../handlers/items/myPostViewDetail/requestParams.js";

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
  app.get<{ Params: GetAcceptedClaimContactRequestParams }>(
    "/items/:itemId/claims/:claimId/contact",
    {
      preHandler: app.verifyUser,
      schema: GetAcceptedClaimContactSchema,
    },
    getAcceptedClaimContactHandler,
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

  app.patch<{
    Params: UpdateMyPostRequestParams;
    Body: UpdateMyPostRequestBody;
  }>(
    "/item/updateposts/:itemId",
    {
      preHandler: app.verifyUser,
      schema: UpdateMyPostSchema,
    },
    updateMyPostHandler,
  );

  app.get(
    "/item/myclaims/:claimId",
    {
      preHandler: app.verifyUser,
      schema: MyClaimDetailsSchema,
    },
    myClaimDetailsHandler,
  );

  app.get<{ Params: MyPostViewDetailRequestParams }>(
    "/item/mypostviewdetail/:itemId",
    {
      preHandler: app.verifyUser,
      schema: MyPostViewDetailSchema,
    },
    myPostViewDetailHandler,
  );
}
