import { FastifyInstance } from "fastify";
import { AdminDashboardSchema } from "../handlers/admin/adminDashboard/schema.js";
import { adminDashboardHandler } from "../handlers/admin/adminDashboard/handler.js";
import { ManageListingsSchema } from "../handlers/admin/manageListings/schema.js";
import { manageListingsHandler } from "../handlers/admin/manageListings/handler.js";

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
    )

}