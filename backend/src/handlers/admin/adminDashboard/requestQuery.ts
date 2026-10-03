import { Type, type Static } from "@sinclair/typebox";

const DashboardPeriodQuerySchema = Type.Unsafe<
  "ALL_TIME" | "THIS_YEAR" | "THIS_MONTH" | "THIS_WEEK" | "TODAY"
>({
  type: "string",
  enum: ["ALL_TIME", "THIS_YEAR", "THIS_MONTH", "THIS_WEEK", "TODAY"],
});

export const AdminDashboardRequestQuerySchema = Type.Object({
    period: Type.Optional(DashboardPeriodQuerySchema),
});

export type AdminDashboardRequestQuery = Static<
  typeof AdminDashboardRequestQuerySchema
>;
