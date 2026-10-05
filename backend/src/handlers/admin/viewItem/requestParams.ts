import { Type, type Static } from "@sinclair/typebox";

export const ViewItemRequestParamsSchema = Type.Object({
  itemId: Type.String({ format: "uuid" }),
});

export type ViewItemRequestParams = Static<typeof ViewItemRequestParamsSchema>;
