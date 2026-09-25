import { Type, type Static } from "@sinclair/typebox";

export const GetColorResponseBodySchema = Type.Array(
  Type.Object({
    id: Type.String({ format: "uuid" }),
    name: Type.String(),
  }),
);

export type GetColorResponseBody = Static<typeof GetColorResponseBodySchema>;
