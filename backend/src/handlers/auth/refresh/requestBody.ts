import { Type, type Static } from "@sinclair/typebox";

export const RefreshRequestBodySchema = Type.Object({
    refreshToken: Type.String({ minLength: 1 }),
});

export type RefreshRequestBody = Static<typeof RefreshRequestBodySchema>;
