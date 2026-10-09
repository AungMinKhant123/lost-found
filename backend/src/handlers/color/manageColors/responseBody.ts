import { Type, type Static } from "@sinclair/typebox";

const ColorSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
  hexCode: Type.String(),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export const ManageColorResponseBodySchema = Type.Object({
  data: ColorSchema,
});

export const DeleteColorResponseBodySchema = Type.Object({
  message: Type.String(),
});

export type ManageColorResponseBody = Static<
  typeof ManageColorResponseBodySchema
>;

export type DeleteColorResponseBody = Static<
  typeof DeleteColorResponseBodySchema
>;
