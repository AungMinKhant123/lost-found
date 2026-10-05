import { Type, type Static } from "@sinclair/typebox";

export const UpdateMyPostRequestParamsSchema = Type.Object({
  itemId: Type.String({ format: "uuid" }),
});

export type UpdateMyPostRequestParams = Static<
  typeof UpdateMyPostRequestParamsSchema
>;
