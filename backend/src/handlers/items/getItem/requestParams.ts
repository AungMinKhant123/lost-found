import { Type, type Static } from "@sinclair/typebox";

export const GetItemRequestParamsSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
});

export type GetItemRequestParams = Static<typeof GetItemRequestParamsSchema>;
