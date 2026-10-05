import { FastifyInstance } from "fastify";
import { adminDashboardHandler } from "../handlers/admin/adminDashboard/handler.js";
import { AdminDashboardSchema } from "../handlers/admin/adminDashboard/schema.js";
import { manageListingsHandler } from "../handlers/admin/manageListings/handler.js";
import { ManageListingsSchema } from "../handlers/admin/manageListings/schema.js";
import { viewItemHandler } from "../handlers/admin/viewItem/handler.js";
import { ViewItemSchema } from "../handlers/admin/viewItem/schema.js";
import { DeleteItemSchema } from "../handlers/admin/deleteItem/schema.js";
import { deleteItemHandler } from "../handlers/admin/deleteItem/handler.js";

export async function adminRoutes(app: FastifyInstance) {
    
    app.get(
        "/admin/dashboard",
        {
            preHandler: app.verifyAdmin,
            schema: AdminDashboardSchema,
        },
        adminDashboardHandler,
    );

    app.get(
        "/admin/manage-listings",
        {
            preHandler: app.verifyAdmin,
            schema: ManageListingsSchema,
        },
        manageListingsHandler,
    );

    app.get(
        "/admin/manage-listings/:itemId",
        {
            preHandler: app.verifyAdmin,
            schema: ViewItemSchema,
        },
        viewItemHandler,
    );

    app.delete(
        "/admin/manage-listings/:itemId",
        {
            preHandler: app.verifyAdmin,
            schema: DeleteItemSchema,
        },
        deleteItemHandler,
    )

}