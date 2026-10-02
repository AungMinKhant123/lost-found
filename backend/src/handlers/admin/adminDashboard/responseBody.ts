import { Type, type Static } from "@sinclair/typebox";

const SummarySchema = Type.Object({
  totalClaimsMade: Type.Number(),
  resolvedItems: Type.Number(),
  openItems: Type.Number(),
  totalItemsPosted: Type.Number(),
});

const CategoryCountSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
  count: Type.Number(),
});

const RecentActivitySchema = Type.Object({
  id: Type.String(),
  type: Type.Union([
    Type.Literal("CLAIM_SUBMITTED"),
    Type.Literal("ITEM_POSTED"),
    Type.Literal("ITEM_RESOLVED"),
  ]),
  message: Type.String(),
  occurredAt: Type.String({ format: "date-time" }),
});

export const AdminDashboardResponseBodySchema = Type.Object({
  data: Type.Object({
    summary: SummarySchema,

    itemsByCategory: Type.Array(CategoryCountSchema),

    recentActivity: Type.Array(RecentActivitySchema),
  }),
});

export type AdminDashboardResponseBody = Static<
  typeof AdminDashboardResponseBodySchema
>;
