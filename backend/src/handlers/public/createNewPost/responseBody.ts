import { Type, type Static } from "@sinclair/typebox";

export const CreateNewPostResponseBodySchema = Type.Object({
  message: Type.String(),
});

export type CreateNewPostResponseBody = Static<
  typeof CreateNewPostResponseBodySchema
>;
