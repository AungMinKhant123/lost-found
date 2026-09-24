import { FastifyInstance } from "fastify";
import { MyPostsSchema } from "../handlers/items/myPosts/schema.js";
import { myPostsHandler } from "../handlers/items/myPosts/handler.js";
import { MyClaimsSchema } from "../handlers/items/myClaims/schema.js";
import { myClaimsHandler } from "../handlers/items/myClaims/handler.js";

export async function itemRoutes(app: FastifyInstance) {
    app.get(
        "/item/myposts",
        {
            preHandler: app.verifyUser,
            schema: MyPostsSchema
        },
        myPostsHandler,
    );

    app.get(
        "/item/myclaims",
        {
            preHandler: app.verifyUser,
            schema: MyClaimsSchema
        },
        myClaimsHandler,
    )
}