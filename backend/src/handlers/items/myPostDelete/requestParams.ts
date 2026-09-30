import { Type, type Static } from '@sinclair/typebox'

export const MyPostDeleteRequestParamsSchema = Type.Object({
    itemId: Type.String({ format: "uuid" }),
})

export type MyPostDeleteRequestParams =
    Static<typeof MyPostDeleteRequestParamsSchema>