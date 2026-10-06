import { Type, type Static } from "@sinclair/typebox";

export const UpdateMyPostResponseBodySchema = Type.Object({
  message: Type.String(),
});

export type UpdateMyPostResponseBody = Static<
  typeof UpdateMyPostResponseBodySchema
>;
