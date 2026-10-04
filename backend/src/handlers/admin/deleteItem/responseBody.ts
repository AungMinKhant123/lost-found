import { Type, type Static } from '@sinclair/typebox'

export const DeleteItemResponseBodySchema = Type.Object({
    message: Type.String(),
})

export type DeleteItemResponseBody =
    Static<typeof DeleteItemResponseBodySchema>