import { Type, type Static } from "@sinclair/typebox";

export const UserDeleteResponseBodySchema = Type.Object({
  message: Type.String(),
});

export type UserDeleteResponseBody = Static<
  typeof UserDeleteResponseBodySchema
>;
