import { Type, type Static } from '@sinclair/typebox'

export const MyPostDeleteResponseBodySchema = Type.Object({
    message: Type.String(),
})

export type MyPostDeleteResponseBody =
    Static<typeof MyPostDeleteResponseBodySchema>