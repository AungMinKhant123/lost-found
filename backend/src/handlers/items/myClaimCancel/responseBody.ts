import { Type, type Static } from '@sinclair/typebox'

export const MyClaimCancelResponseBodySchema = Type.Object({
    message: Type.String(),
})

export type MyClaimCancelResponseBody =
    Static<typeof MyClaimCancelResponseBodySchema>