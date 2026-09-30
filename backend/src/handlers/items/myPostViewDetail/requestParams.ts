import { Type, type Static } from "@sinclair/typebox";

export const MyPostViewDetailRequestParamsSchema = Type.Object({
  itemId: Type.String({ format: "uuid" }),
});

export type MyPostViewDetailRequestParams = Static<
  typeof MyPostViewDetailRequestParamsSchema
>;
