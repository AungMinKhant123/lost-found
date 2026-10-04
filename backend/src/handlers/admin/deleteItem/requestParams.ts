import { Type, type Static } from "@sinclair/typebox";

export const DeleteItemRequestParamsSchema = Type.Object({
  itemId: Type.String({ format: "uuid" }),
});

export type DeleteItemRequestParams = Static<
  typeof DeleteItemRequestParamsSchema
>;
