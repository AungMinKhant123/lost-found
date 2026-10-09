import { Type, type Static } from "@sinclair/typebox";

export const ManageColorRequestParamsSchema = Type.Object({
  colorId: Type.String({ format: "uuid" }),
});

export type ManageColorRequestParams = Static<
  typeof ManageColorRequestParamsSchema
>;
