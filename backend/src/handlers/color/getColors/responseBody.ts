import { Type, type Static } from "@sinclair/typebox";

export const GetColorResponseBodySchema = Type.Array(
  Type.Object({
    id: Type.String({ format: "uuid" }),
    name: Type.String(),
    hexCode: Type.String(),
    itemCount: Type.Number(),
  }),
);

export type GetColorResponseBody = Static<typeof GetColorResponseBodySchema>;
